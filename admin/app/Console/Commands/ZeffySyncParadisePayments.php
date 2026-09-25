<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

/**
 * Reconcile Camp Paradise Zeffy ticket payments via the Zeffy REST API.
 *
 * Mirrors camp-paradise/src/lib/server/paradise/zeffy.ts applyPayment():
 * one paradise_tickets row per ticket item, credited to the buyer email for the
 * paradise_event whose zeffy_campaign_id matches the payment's campaign.
 * Safety net for the webhook; safe to re-run (idempotent).
 */
class ZeffySyncParadisePayments extends Command
{
    protected $signature = 'zeffy:sync-paradise {--full : Ignore the watermark and re-scan all succeeded payments}';

    protected $description = 'Sync Camp Paradise Zeffy payments into D1 ticket credits';

    private const API_BASE = 'https://api.zeffy.com';

    private const WATERMARK_KEY = 'zeffy_paradise_sync_watermark';

    private int $granted = 0;

    private int $revoked = 0;

    private int $unmatched = 0;

    public function handle(): int
    {
        $apiKey = env('ZEFFY_CAMP_PARADISE_API_KEY');
        if (! $apiKey) {
            $this->error('ZEFFY_CAMP_PARADISE_API_KEY is not set.');

            return self::FAILURE;
        }

        $watermark = $this->option('full') ? null : $this->readWatermark();
        $maxCreated = $watermark;
        $cursor = null;
        $pages = 0;
        $seen = 0;

        do {
            $query = ['limit' => 100, 'status' => 'succeeded'];
            if ($watermark) {
                $query['created[gt]'] = $watermark;
            }
            if ($cursor) {
                $query['starting_after'] = $cursor;
            }

            $response = $this->request($apiKey, $query);
            if ($response === null) {
                return self::FAILURE;
            }

            foreach ($response['data'] ?? [] as $payment) {
                $seen++;
                $this->applyPayment($payment);
                $created = (int) ($payment['created'] ?? 0);
                if ($created > (int) $maxCreated) {
                    $maxCreated = $created;
                }
            }

            $cursor = ($response['has_more'] ?? false) ? ($response['next_cursor'] ?? null) : null;
            $pages++;
            if ($cursor) {
                usleep(150000);
            }
        } while ($cursor && $pages < 200);

        if ($maxCreated && $maxCreated !== $watermark) {
            $this->writeWatermark((int) $maxCreated);
        }

        $this->info("Scanned {$seen} payment(s) over {$pages} page(s): {$this->granted} granted, {$this->revoked} revoked, {$this->unmatched} unmatched.");

        return self::SUCCESS;
    }

    /** GET /api/v1/payments with 429 back-off. Returns decoded JSON or null on hard failure. */
    private function request(string $apiKey, array $query): ?array
    {
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $res = Http::withToken($apiKey)->acceptJson()->get(self::API_BASE.'/api/v1/payments', $query);

            if ($res->status() === 429) {
                $wait = (int) ($res->header('Retry-After') ?: 2);
                $this->warn("Rate limited; sleeping {$wait}s.");
                sleep(max(1, $wait));

                continue;
            }

            if (! $res->ok()) {
                $this->error("Zeffy API error {$res->status()}: ".mb_substr($res->body(), 0, 300));

                return null;
            }

            return $res->json() ?? [];
        }

        $this->error('Zeffy API: too many rate-limit retries.');

        return null;
    }

    private function readWatermark(): ?int
    {
        $row = DB::connection('plumbing')->table('zeffy_kv')->where('key', self::WATERMARK_KEY)->first();

        return $row ? (int) $row->value : null;
    }

    private function writeWatermark(int $value): void
    {
        DB::connection('plumbing')->table('zeffy_kv')->updateOrInsert(
            ['key' => self::WATERMARK_KEY],
            ['value' => (string) $value]
        );
    }

    private function applyPayment(array $p): void
    {
        $d1 = DB::connection('d1_paradise');
        $now = now()->utc()->format('Y-m-d H:i:s');
        $id = (string) ($p['id'] ?? '');

        if ($id === '') {
            return;
        }

        $refunded = in_array($p['refund_status'] ?? 'none', ['partial', 'full'], true) || ! empty($p['dispute']);

        if ($refunded) {
            $tickets = $d1->table('paradise_tickets')->where('zeffy_payment_id', $id)->get();

            if ($tickets->isNotEmpty()) {
                $d1->table('paradise_tickets')
                    ->where('zeffy_payment_id', $id)
                    ->update(['status' => 'revoked', 'updated_at' => $now]);

                $resIds = $tickets->pluck('reservation_id')->filter()->values()->all();

                if ($resIds !== []) {
                    $d1->table('paradise_reservations')
                        ->whereIn('id', $resIds)
                        ->where('status', 'confirmed')
                        ->update(['status' => 'cancelled', 'updated_at' => $now]);
                }
            }

            $this->upsertPayment($d1, $p, 'refunded', null, $tickets->count(), $now);
            $this->revoked++;

            return;
        }

        if (($p['status'] ?? '') !== 'succeeded') {
            $this->upsertPayment($d1, $p, 'unmatched', null, 0, $now);
            $this->unmatched++;

            return;
        }

        $email = strtolower(trim((string) ($p['buyer']['email'] ?? '')));
        $campaign = $p['campaign_id'] ?? null;
        $event = $campaign
            ? $d1->table('paradise_events')->where('zeffy_campaign_id', $campaign)->first()
            : null;

        if (! $event || $email === '') {
            $this->upsertPayment($d1, $p, 'unmatched', null, 0, $now);
            $this->unmatched++;

            return;
        }

        $attendeeId = $d1->table('paradise_attendees')->where('email', $email)->value('id');
        $inserted = 0;

        foreach ($p['items'] ?? [] as $item) {
            $type = $item['type'] ?? null;

            if (($type !== null && $type !== 'ticket') || empty($item['id'])) {
                continue;
            }

            $inserted += (int) $d1->table('paradise_tickets')->insertOrIgnore([
                'event_id' => $event->id,
                'email' => $email,
                'attendee_id' => $attendeeId,
                'zeffy_payment_id' => $id,
                'zeffy_item_id' => $item['id'],
                'rate_title' => $item['rate_title'] ?? null,
                'amount_cents' => (int) ($item['amount'] ?? 0),
                'status' => 'available',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $total = $d1->table('paradise_tickets')->where('zeffy_payment_id', $id)->count();
        $this->upsertPayment($d1, $p, 'matched', (int) $event->id, $total, $now);
        $this->granted += $inserted;
    }

    private function upsertPayment($d1, array $p, string $matchStatus, ?int $eventId, int $tickets, string $now): void
    {
        $id = (string) ($p['id'] ?? '');
        $email = strtolower(trim((string) ($p['buyer']['email'] ?? '')));

        $row = [
            'status' => $p['status'] ?? 'unknown',
            'amount' => (int) ($p['amount'] ?? 0),
            'currency' => $p['currency'] ?? 'usd',
            'buyer_email' => $email !== '' ? $email : null,
            'buyer_first_name' => $p['buyer']['first_name'] ?? null,
            'buyer_last_name' => $p['buyer']['last_name'] ?? null,
            'campaign_id' => $p['campaign_id'] ?? null,
            'contact_id' => $p['contact'] ?? $p['contact_id'] ?? null,
            'event_id' => $eventId,
            'match_status' => $matchStatus,
            'tickets_granted' => $tickets,
            'raw_json' => json_encode($p),
            'updated_at' => $now,
        ];

        $exists = $d1->table('paradise_zeffy_payments')->where('zeffy_payment_id', $id)->exists();

        if ($exists) {
            $d1->table('paradise_zeffy_payments')->where('zeffy_payment_id', $id)->update($row);
        } else {
            $d1->table('paradise_zeffy_payments')->insert($row + ['zeffy_payment_id' => $id, 'created_at' => $now]);
        }
    }
}
