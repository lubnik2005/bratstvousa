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
 * Check an attendee in WITHOUT collecting cash (spec §24 Cases A & C).
 *
 * Use this for attendees who already satisfied payment — paid online (ONLINE /
 * PAID) or whose cash was already collected elsewhere (CASH / PAID). It does
 * NOT touch payment fields. Attendees who still owe money (DUE / REVIEW_REQUIRED
 * / PENDING) are skipped — collect via "Cash Received & Check In" instead so we
 * never silently admit an unpaid attendee (spec §8/§16).
 */
class CheckIn extends Action
{
    use Queueable;

    public $name = 'Check In';

    public function handle(ActionFields $fields, Collection $models): ActionResponse
    {
        $actor = Auth::user();
        $actorLabel = $actor ? ($actor->name.' (#'.$actor->getKey().')') : 'unknown';

        $done = 0;
        $alreadyIn = 0;
        $blocked = 0;

        foreach ($models as $registration) {
            /** @var CampRegistration $registration */

            // Case E: already checked in — warn, don't double-record.
            if ($registration->checkin_status === 'CHECKED_IN') {
                $alreadyIn++;

                continue;
            }

            // Block admission for anyone who still owes money. Fee-waived rows are
            // allowed through (payment_status PAID with method WAIVED).
            if (! in_array($registration->payment_status, ['PAID'], true)) {
                $blocked++;

                continue;
            }

            try {
                // D1 has no interactive transactions (see D1Connection); a single
                // UPDATE is atomic on its own, audit row follows best-effort.
                $now = now()->toIso8601String();
                $registration->checkin_status = 'CHECKED_IN';
                $registration->checked_in_at = $now;
                $registration->checked_in_by = $actorLabel;
                $registration->save();

                $this->recordEvent($registration->id, 'checked_in', null, $actorLabel, [
                    'source' => 'nova:check_in',
                    'payment_status' => $registration->payment_status,
                    'payment_method' => $registration->payment_method,
                ]);
                $done++;
            } catch (\Throwable $e) {
                Log::error('CheckIn failed', [
                    'registration_id' => $registration->id,
                    'error' => $e->getMessage(),
                ]);

                return ActionResponse::danger('Failed to check in registration #'.$registration->id.'.');
            }
        }

        $msg = "Checked in {$done} attendee(s).";
        if ($alreadyIn > 0) {
            $msg .= " {$alreadyIn} already checked in.";
        }
        if ($blocked > 0) {
            $msg .= " {$blocked} still owe payment — use “Cash Received & Check In”.";
        }

        return ActionResponse::message($msg);
    }

    /**
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
