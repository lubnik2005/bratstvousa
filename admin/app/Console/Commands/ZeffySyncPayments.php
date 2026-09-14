<?php

namespace App\Console\Commands;

use App\Models\CampRegistration;
use App\Models\ZeffyPayment;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ZeffySyncPayments extends Command
{
    /**
     * @var string
     */
    protected $signature = 'zeffy:sync {--full : Ignore the watermark and scan all payments}';

    /**
     * @var string
     */
    protected $description = 'Pull succeeded Zeffy payments and reconcile them against camp registrations (safety net for the webhook).';

    private const API_BASE = 'https://api.zeffy.com';

    private const WATERMARK_KEY = 'zeffy_sync_watermark';

    private const CAMP_CODE_RE = '/CAMP-[A-Z0-9]+/i';

    public function handle(): int
    {
        $apiKey = env('ZEFFY_API_KEY');
        if (! $apiKey) {
            $this->error('ZEFFY_API_KEY is not configured.');

            return self::FAILURE;
        }

        $watermark = $this->option('full') ? 0 : $this->getWatermark();
        $this->info('Zeffy sync starting (watermark='.$watermark.').');

        $cursor = null;
        $maxCreated = $watermark;
        $processed = 0;
        $matched = 0;
        $unmatched = 0;

        do {
            $query = [
                'limit' => 100,
                'status' => 'succeeded',
            ];
            if ($watermark > 0) {
                $query['created[gt]'] = $watermark;
            }
            if ($cursor) {
                $query['starting_after'] = $cursor;
            }

            $response = Http::withToken($apiKey)
                ->acceptJson()
                ->timeout(30)
                ->get(self::API_BASE.'/api/v1/payments', $query);

            if ($response->status() === 429) {
                $retryAfter = (int) ($response->header('Retry-After') ?: 60);
                $this->warn("Rate limited; sleeping {$retryAfter}s.");
                sleep($retryAfter);

                continue;
            }

            if (! $response->successful()) {
                $this->error('Zeffy API error '.$response->status().': '.$response->body());
                Log::error('zeffy:sync API error', ['status' => $response->status(), 'body' => $response->body()]);

                return self::FAILURE;
            }

            $body = $response->json();
            $payments = $body['data'] ?? [];

            foreach ($payments as $payment) {
                $this->applyPayment($payment, $matched, $unmatched);
                $processed++;
                $created = (int) ($payment['created'] ?? 0);
                if ($created > $maxCreated) {
                    $maxCreated = $created;
                }
            }

            $hasMore = (bool) ($body['has_more'] ?? false);
            $cursor = $body['next_cursor'] ?? null;

            // Gentle pacing against the 20 req/sec burst ceiling.
            if ($hasMore) {
                usleep(150000);
            }
        } while ($hasMore && $cursor);

        if ($maxCreated > $watermark) {
            $this->setWatermark($maxCreated);
        }

        $this->info("Zeffy sync done: processed={$processed} matched={$matched} unmatched={$unmatched} watermark={$maxCreated}.");

        return self::SUCCESS;
    }

    /**
     * Reconcile a single Zeffy payment against camp registrations.
     * Skips payments already handled (by the webhook or a prior run) via the
     * unique zeffy_payment_id in zeffy_payments.
     *
     * @param  array<string, mixed>  $payment
     */
    private function applyPayment(array $payment, int &$matched, int &$unmatched): void
    {
        $zeffyId = $payment['id'] ?? null;
        if (! $zeffyId) {
            return;
        }

        // Idempotency: if a row already exists, the webhook (or an earlier run)
        // has processed this payment. Leave it alone.
        if (ZeffyPayment::where('zeffy_payment_id', $zeffyId)->exists()) {
            return;
        }

        $buyer = $payment['buyer'] ?? [];
        $buyerEmail = $buyer['email'] ?? null;
        $code = $this->extractCampCode($payment);

        $registration = null;
        if ($code) {
            $registration = CampRegistration::whereRaw('upper(confirmation_code) = ?', [strtoupper($code)])->first();
        }
        if (! $registration && $buyerEmail) {
            $registration = CampRegistration::whereRaw('lower(email) = ?', [strtolower($buyerEmail)])->first();
        }

        $matchStatus = $registration ? 'matched' : 'unmatched';

        if ($registration) {
            $registration->payment_status = 'paid';
            $registration->zeffy_payment_id = $zeffyId;
            $registration->paid_at = now()->toIso8601String();
            $registration->save();
            $matched++;
        } else {
            $unmatched++;
        }

        ZeffyPayment::create([
            'zeffy_payment_id' => $zeffyId,
            'status' => $payment['status'] ?? null,
            'amount' => $payment['amount'] ?? null,
            'currency' => $payment['currency'] ?? null,
            'buyer_email' => $buyerEmail,
            'buyer_first_name' => $buyer['first_name'] ?? null,
            'buyer_last_name' => $buyer['last_name'] ?? null,
            'confirmation_code' => $code,
            'matched_registration_id' => $registration?->id,
            'match_status' => $matchStatus,
            'raw_json' => json_encode($payment),
        ]);

        if (! $registration && $buyerEmail) {
            $this->sendUnmatchedEmail($buyerEmail, $buyer['first_name'] ?? null);
        }
    }

    /**
     * Scan buyer_questions[] and items[].questions[] for a CAMP-XXXXX code.
     *
     * @param  array<string, mixed>  $payment
     */
    private function extractCampCode(array $payment): ?string
    {
        $scan = function (array $questions): ?string {
            foreach ($questions as $q) {
                $answer = $q['answer'] ?? null;
                $candidates = is_array($answer) ? $answer : [$answer];
                foreach ($candidates as $candidate) {
                    if (is_string($candidate) && preg_match(self::CAMP_CODE_RE, $candidate, $m)) {
                        return strtoupper($m[0]);
                    }
                }
            }

            return null;
        };

        $code = $scan($payment['buyer_questions'] ?? []);
        if ($code) {
            return $code;
        }

        foreach ($payment['items'] ?? [] as $item) {
            $code = $scan($item['questions'] ?? []);
            if ($code) {
                return $code;
            }
        }

        return null;
    }

    private function sendUnmatchedEmail(string $email, ?string $firstName): void
    {
        try {
            $greeting = $firstName ? 'Здравствуйте, '.$firstName.'!' : 'Здравствуйте!';
            $html = '<p>'.$greeting.'</p>'
                .'<p>Мы получили вашу оплату за Осенний молодёжный лагерь СЗР 2026, '
                .'но не смогли связать её с регистрацией.</p>'
                .'<p>Без регистрации участие в лагере невозможно. Пожалуйста, свяжитесь '
                .'с Вадимом Нейманом, написав на <a href="mailto:youth@bratstvousa.com">youth@bratstvousa.com</a>, '
                .'чтобы мы помогли решить этот вопрос.</p>'
                .'<p>С благословением,<br>Команда Bratstvo USA</p>';

            Mail::html($html, function ($message) use ($email) {
                $message->to($email)->subject('Проблема с оплатой — Осенний молодёжный лагерь СЗР 2026');
            });
        } catch (\Throwable $e) {
            Log::error('zeffy:sync unmatched email failed', ['email' => $email, 'error' => $e->getMessage()]);
        }
    }

    private function getWatermark(): int
    {
        $value = DB::connection('plumbing')->table('zeffy_kv')->where('key', self::WATERMARK_KEY)->value('value');

        return (int) ($value ?? 0);
    }

    private function setWatermark(int $created): void
    {
        DB::connection('plumbing')->table('zeffy_kv')->updateOrInsert(
            ['key' => self::WATERMARK_KEY],
            ['value' => (string) $created, 'updated_at' => now()]
        );
    }
}
