<?php

namespace App\Console\Commands;

use App\Models\CampRegistration;
use App\Models\CashEligibilityRule;
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
        $ids = $this->extractIdentifiers($payment);
        $amount = (int) ($payment['amount'] ?? 0);

        $registration = null;
        if ($code) {
            $registration = CampRegistration::whereRaw('upper(confirmation_code) = ?', [strtoupper($code)])->first();
        }
        if (! $registration && $buyerEmail) {
            $registration = CampRegistration::whereRaw('lower(email) = ?', [strtolower($buyerEmail)])->first();
        }

        // Registration-code abuse guard (spec §23): if this registration is
        // already linked to a different Zeffy payment, do not overwrite it.
        if ($registration && $registration->zeffy_payment_id && $registration->zeffy_payment_id !== $zeffyId) {
            ZeffyPayment::create([
                'zeffy_payment_id' => $zeffyId,
                'status' => $payment['status'] ?? null,
                'amount' => $amount,
                'currency' => $payment['currency'] ?? null,
                'buyer_email' => $buyerEmail,
                'buyer_first_name' => $buyer['first_name'] ?? null,
                'buyer_last_name' => $buyer['last_name'] ?? null,
                'confirmation_code' => $code,
                'matched_registration_id' => $registration->id,
                'match_status' => 'duplicate',
                'raw_json' => json_encode($payment),
            ]);
            $this->recordEvent($registration->id, 'duplicate_registration_code', $amount, [
                'zeffy_payment_id' => $zeffyId,
                'existing_zeffy_payment_id' => $registration->zeffy_payment_id,
                'buyer_email' => $buyerEmail,
                'discount_code' => $ids['discountCode'],
                'source' => 'zeffy:sync',
            ]);
            $this->sendDuplicateEmails(
                $buyerEmail,
                $buyer['first_name'] ?? null,
                $registration->id,
                $code,
                $amount,
                $zeffyId,
                $registration->zeffy_payment_id,
            );
            $unmatched++;

            return;
        }

        $matchStatus = $registration ? 'matched' : 'unmatched';

        if ($registration) {
            // Price snapshot in cents; fall back to legacy dollar amount * 100.
            $priceCents = (int) ($registration->event_price_cents ?? (($registration->amount ?? 0) * 100));
            $auditEvent = null;
            $auditAmount = null;
            $auditPayload = [
                'zeffy_payment_id' => $zeffyId,
                'source' => 'zeffy:sync',
                'discount_code' => $ids['discountCode'],
                'face_value_cents' => $ids['faceValueCents'],
                'campaign_id' => $ids['campaignId'],
            ];

            // Campaign guard (spec §22): if any active rule for this event pins a
            // Zeffy campaign, the ticket must come from one of them; otherwise force
            // staff review regardless of amount or cash eligibility.
            $allowedCampaigns = $this->findCampaignIdsForEvent($registration->event_slug);
            $campaignMismatch = $allowedCampaigns !== []
                && ($ids['campaignId'] === null || ! in_array($ids['campaignId'], $allowedCampaigns, true));
            $auditPayload['allowed_campaign_ids'] = $allowedCampaigns;
            $auditPayload['campaign_match'] = $allowedCampaigns !== [] ? ! $campaignMismatch : null;

            if ($campaignMismatch) {
                $registration->payment_status = 'REVIEW_REQUIRED';
                $registration->amount_paid_cents = 0;
                $registration->amount_due_cents = $priceCents;
                $auditEvent = 'campaign_mismatch';
                $auditAmount = $amount;
                $auditPayload['zeffy_amount_cents'] = $amount;
            } elseif ($amount > 0) {
                // Normal paid online checkout.
                $registration->payment_method = 'ONLINE';
                $registration->payment_status = 'PAID';
                $registration->amount_paid_cents = $amount;
                $registration->amount_due_cents = 0;
                $registration->paid_at = now()->toIso8601String();
                $auditEvent = 'online_payment';
                $auditAmount = $amount;
            } else {
                // $0 checkout. The registration's cash_eligible flag (set at
                // registration from cash_eligibility_rules) is authoritative; the
                // discount code on the payload is only an audit/validation signal.
                $rule = $this->findRuleFor($registration);
                $expectedCode = $rule?->discount_code;
                $codeMatch = $expectedCode !== null
                    && $ids['discountCode'] !== null
                    && strcasecmp($expectedCode, $ids['discountCode']) === 0;
                $auditPayload['expected_code'] = $expectedCode;
                $auditPayload['code_match'] = $codeMatch;
                $auditPayload['rule_id'] = $rule?->id;

                if ($registration->cash_eligible) {
                    // Authorized $0 checkout — cash due at check-in (spec §11).
                    $registration->payment_method = 'CASH';
                    $registration->payment_status = 'DUE';
                    $registration->amount_paid_cents = 0;
                    $registration->amount_due_cents = $priceCents;
                    $auditEvent = 'cash_due';
                    $auditAmount = $priceCents;

                    if (! $codeMatch) {
                        // Still DUE (eligibility wins), but flag the mismatch.
                        $this->recordEvent($registration->id, 'discount_code_mismatch', $priceCents, $auditPayload);
                    }
                } else {
                    // Unauthorized $0 checkout — do NOT mark paid (spec §8/§11).
                    $registration->payment_status = 'REVIEW_REQUIRED';
                    $registration->amount_paid_cents = 0;
                    $registration->amount_due_cents = $priceCents;
                    $auditEvent = 'unauthorized_zero_dollar';
                    $auditAmount = $priceCents;

                    // If the code belongs to some other church's active rule, note
                    // where it leaked from (never used as proof of eligibility).
                    $leaked = $this->findRuleByCode($ids['discountCode'], $registration->event_slug);
                    if ($leaked) {
                        $auditPayload['leaked_from_rule_id'] = $leaked->id;
                        $auditPayload['leaked_from_church_id'] = $leaked->church_id;
                    }
                }
            }

            $registration->zeffy_payment_id = $zeffyId;
            $registration->zeffy_ticket_id = $ids['ticketId'];
            $registration->zeffy_contact_id = $ids['contactId'];
            $registration->zeffy_campaign_id = $ids['campaignId'];
            $registration->zeffy_discount_code = $ids['discountCode'];
            $registration->save();

            $this->recordEvent($registration->id, $auditEvent, $auditAmount, $auditPayload);
            $matched++;
        } else {
            $unmatched++;
        }

        ZeffyPayment::create([
            'zeffy_payment_id' => $zeffyId,
            'status' => $payment['status'] ?? null,
            'amount' => $amount,
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
     * Extract Zeffy identifiers (ticket/contact/campaign/discount) from a payment
     * payload. Mirrors extractZeffyIdentifiers() in the SvelteKit app.
     *
     * Real payload shapes (observed): `discount: {code, amount}`, top-level
     * `contact` (uuid), `items[0].contact_id`, `items[0].amount` = ticket face
     * value in cents even when the checkout total is $0.
     *
     * @param  array<string, mixed>  $payment
     * @return array{ticketId: ?string, contactId: ?string, campaignId: ?string, discountCode: ?string, faceValueCents: ?int}
     */
    private function extractIdentifiers(array $payment): array
    {
        $items = $payment['items'] ?? [];
        $firstItem = is_array($items[0] ?? null) ? $items[0] : [];
        $buyer = is_array($payment['buyer'] ?? null) ? $payment['buyer'] : [];
        $discount = is_array($payment['discount'] ?? null) ? $payment['discount'] : [];

        $stringOrNull = static fn ($v): ?string => (is_string($v) || is_int($v)) ? (string) $v : null;
        $faceValue = $firstItem['amount'] ?? null;

        return [
            'ticketId' => $stringOrNull($firstItem['ticket_id'] ?? $firstItem['id'] ?? null),
            'contactId' => $stringOrNull(
                $payment['contact'] ?? $payment['contact_id'] ?? $firstItem['contact_id'] ?? $buyer['contact_id'] ?? $buyer['id'] ?? null
            ),
            'campaignId' => $stringOrNull($payment['campaign_id'] ?? null),
            'discountCode' => $stringOrNull(
                $discount['code'] ?? $payment['discount_code'] ?? $payment['discountCode'] ?? $payment['promo_code'] ?? null
            ),
            'faceValueCents' => is_numeric($faceValue) ? (int) $faceValue : null,
        ];
    }

    /**
     * Active cash-eligibility rule for this registration's church + event.
     */
    private function findRuleFor(CampRegistration $registration): ?CashEligibilityRule
    {
        if (! $registration->church_id) {
            return null;
        }

        try {
            return CashEligibilityRule::where('church_id', $registration->church_id)
                ->where('event_slug', $registration->event_slug)
                ->where('active', true)
                ->first();
        } catch (\Throwable $e) {
            Log::warning('zeffy:sync rule lookup failed', ['error' => $e->getMessage()]);

            return null;
        }
    }

    /**
     * Distinct Zeffy campaign ids pinned by active rules for an event.
     * Empty array = no campaign restriction configured.
     *
     * @return string[]
     */
    private function findCampaignIdsForEvent(?string $eventSlug): array
    {
        if (! $eventSlug) {
            return [];
        }

        try {
            return CashEligibilityRule::where('event_slug', $eventSlug)
                ->where('active', true)
                ->whereNotNull('zeffy_campaign_id')
                ->where('zeffy_campaign_id', '<>', '')
                ->pluck('zeffy_campaign_id')
                ->unique()
                ->values()
                ->all();
        } catch (\Throwable $e) {
            Log::warning('zeffy:sync campaign lookup failed', ['error' => $e->getMessage()]);

            return [];
        }
    }

    /**
     * Any active rule (for the event) whose discount code matches, case-insensitively.
     */
    private function findRuleByCode(?string $code, string $eventSlug): ?CashEligibilityRule
    {
        if (! $code) {
            return null;
        }

        try {
            return CashEligibilityRule::whereRaw('upper(discount_code) = ?', [strtoupper($code)])
                ->where('event_slug', $eventSlug)
                ->where('active', true)
                ->first();
        } catch (\Throwable $e) {
            Log::warning('zeffy:sync rule-by-code lookup failed', ['error' => $e->getMessage()]);

            return null;
        }
    }

    /**
     * Append a row to the registration_events audit trail (best-effort).
     *
     * @param  array<string, mixed>  $payload
     */
    private function recordEvent(int $registrationId, string $event, ?int $amountCents, array $payload): void
    {
        try {
            DB::connection('d1')->table('registration_events')->insert([
                'registration_id' => $registrationId,
                'event' => $event,
                'amount_cents' => $amountCents,
                'staff_user' => null,
                'payload' => json_encode($payload),
                'created_at' => now()->toIso8601String(),
            ]);
        } catch (\Throwable $e) {
            Log::error('zeffy:sync audit insert failed', ['error' => $e->getMessage()]);
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

    /**
     * Mirror of sendDuplicatePaymentNotice() in the SvelteKit app: tell the
     * buyer only one ticket is valid, and tell the organizer to refund/void
     * the extra one in Zeffy. Only reached when the webhook missed the payment.
     */
    private function sendDuplicateEmails(
        ?string $buyerEmail,
        ?string $firstName,
        int $registrationId,
        ?string $code,
        int $amountCents,
        string $duplicateId,
        string $originalId,
    ): void {
        $usd = '$'.number_format($amountCents / 100, 2);
        $codeLabel = $code ?? ('#'.$registrationId);

        if ($buyerEmail) {
            try {
                $greeting = $firstName ? 'Здравствуйте, '.e($firstName).'!' : 'Здравствуйте!';
                $money = $amountCents > 0
                    ? '<p>Повторная оплата на сумму <strong>'.$usd.'</strong> будет возвращена.</p>'
                    : '<p>Повторный билет был бесплатным — возвращать нечего.</p>';
                $html = '<p>'.$greeting.'</p>'
                    .'<p>Мы получили <strong>второй билет</strong> для регистрации <strong>'.e($codeLabel).'</strong> '
                    .'на Осенний молодёжный лагерь СЗР 2026.</p>'
                    .'<p>Действителен только <strong>первый</strong> билет. '
                    .'Второй билет использовать не нужно.</p>'
                    .$money
                    .'<p>Если вы хотели зарегистрировать другого человека, ему нужно заполнить '
                    .'собственную заявку на сайте — один код регистрации действует только для одного участника.</p>'
                    .'<p>Вопросы: <a href="mailto:youth@bratstvousa.com">youth@bratstvousa.com</a></p>'
                    .'<p>С благословением,<br>Команда Bratstvo USA</p>';

                Mail::html($html, function ($message) use ($buyerEmail) {
                    $message->to($buyerEmail)->subject('Повторный билет — Осенний молодёжный лагерь СЗР 2026');
                });
            } catch (\Throwable $e) {
                Log::error('zeffy:sync duplicate buyer email failed', ['email' => $buyerEmail, 'error' => $e->getMessage()]);
            }
        }

        try {
            $action = $amountCents > 0
                ? 'Refund the duplicate payment in Zeffy. The registration is not affected by that refund.'
                : 'The duplicate was a $0 ticket; void it in Zeffy if desired. Nothing to refund.';
            $html = '<p>A second Zeffy payment was received for registration <strong>'.e($codeLabel).'</strong>.</p>'
                .'<table cellpadding="4">'
                .'<tr><td>Buyer</td><td>'.e($buyerEmail ?? '—').'</td></tr>'
                .'<tr><td>Extra amount</td><td>'.$usd.'</td></tr>'
                .'<tr><td>Duplicate payment id</td><td>'.e($duplicateId).'</td></tr>'
                .'<tr><td>Original payment id</td><td>'.e($originalId).'</td></tr>'
                .'</table>'
                .'<p><strong>Action:</strong> '.$action.'</p>'
                .'<p>Admin: Camp Registrations → #'.$registrationId.' → Zeffy Payments.</p>'
                .'<p><em>Detected by the hourly zeffy:sync job.</em></p>';

            Mail::html($html, function ($message) use ($codeLabel) {
                $message->to('youth@bratstvousa.com')->subject('[Camp] Duplicate payment for '.$codeLabel);
            });
        } catch (\Throwable $e) {
            Log::error('zeffy:sync duplicate organizer email failed', ['error' => $e->getMessage()]);
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
