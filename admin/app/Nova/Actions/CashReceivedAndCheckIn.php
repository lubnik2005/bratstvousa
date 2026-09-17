<?php

namespace App\Nova\Actions;

use App\Models\CampRegistration;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Laravel\Nova\Actions\Action;
use Laravel\Nova\Actions\ActionResponse;
use Laravel\Nova\Fields\ActionFields;
use Laravel\Nova\Http\Requests\NovaRequest;

/**
 * Collect cash and check the attendee in, atomically (spec §17).
 *
 * This is the primary cash-at-check-in operation. It must only ever be pressed
 * AFTER the staff member has physically received the cash (spec §16 — scanning a
 * QR never auto-marks paid).
 *
 * Atomicity note: the shared database is Cloudflare D1 over HTTP, and
 * App\Database\D1Connection neutralizes begin/commit/rollback, so a
 * DB::transaction() wrapper would be a silent no-op. Instead, all payment +
 * check-in columns are written by ONE UPDATE statement (a single save()), which
 * D1 executes atomically. The append-only audit row is written afterwards and
 * is best-effort.
 */
class CashReceivedAndCheckIn extends Action
{
    use Queueable;

    public $name = 'Cash Received & Check In';

    public function handle(ActionFields $fields, Collection $models): ActionResponse
    {
        $actor = Auth::user();
        $actorLabel = $actor ? ($actor->name.' (#'.$actor->getKey().')') : 'unknown';

        $done = 0;
        $skipped = 0;

        foreach ($models as $registration) {
            /** @var CampRegistration $registration */

            // Only collect cash for balances that are actually due. Anything
            // already PAID/REFUNDED/CANCELED is skipped so a double-press can't
            // re-collect or corrupt amounts (idempotent-ish guard).
            if (! in_array($registration->payment_status, ['DUE', 'REVIEW_REQUIRED', 'PENDING'], true)) {
                $skipped++;

                continue;
            }

            $due = (int) ($registration->amount_due_cents
                ?? $registration->event_price_cents
                ?? 0);

            try {
                $now = now()->toIso8601String();
                $previousStatus = $registration->payment_status;

                $registration->payment_method = 'CASH';
                $registration->payment_status = 'PAID';
                $registration->amount_paid_cents = $due;
                $registration->amount_due_cents = 0;
                $registration->paid_at = $now;
                $registration->paid_by = $actorLabel;

                $registration->checkin_status = 'CHECKED_IN';
                $registration->checked_in_at = $now;
                $registration->checked_in_by = $actorLabel;

                // Single UPDATE => atomic on D1.
                $registration->save();

                $this->recordEvent($registration->id, 'cash_payment_collected', $due, $actorLabel, [
                    'source' => 'nova:cash_received_and_check_in',
                    'previous_payment_status' => $previousStatus,
                ]);
                $done++;
            } catch (\Throwable $e) {
                Log::error('CashReceivedAndCheckIn failed', [
                    'registration_id' => $registration->id,
                    'error' => $e->getMessage(),
                ]);

                return ActionResponse::danger('Failed to record cash for registration #'.$registration->id.'. Nothing was changed for it.');
            }
        }

        $msg = "Collected cash + checked in {$done} attendee(s).";
        if ($skipped > 0) {
            $msg .= " Skipped {$skipped} (not in a collectable state).";
        }

        return ActionResponse::message($msg);
    }

    /**
     * Append an immutable audit row to registration_events (spec §18).
     *
     * @param  array<string, mixed>  $payload
     */
    private function recordEvent(int $registrationId, string $event, ?int $amountCents, string $staffUser, array $payload): void
    {
        try {
            DB::connection('d1')->table('registration_events')->insert([
                'registration_id' => $registrationId,
                'event' => $event,
                'amount_cents' => $amountCents,
                'staff_user' => $staffUser,
                'payload' => json_encode($payload),
                'created_at' => now()->toIso8601String(),
            ]);
        } catch (\Throwable $e) {
            Log::error('registration_events insert failed', [
                'registration_id' => $registrationId,
                'event' => $event,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * @return array<int, \Laravel\Nova\Fields\Field>
     */
    public function fields(NovaRequest $request): array
    {
        return [];
    }
}
