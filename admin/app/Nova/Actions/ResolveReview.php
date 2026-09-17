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
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Textarea;
use Laravel\Nova\Http\Requests\NovaRequest;

/**
 * Resolve a REVIEW_REQUIRED registration (spec §8 / §24 Case D).
 *
 * A REVIEW_REQUIRED row is an unauthorized $0 Zeffy checkout: a technically
 * valid ticket exists but our system never authorized cash payment. Staff decide
 * how to resolve it:
 *   - authorize_cash : treat as legitimate cash-eligible after all -> CASH / DUE
 *   - waive          : legitimately free (staff/scholarship/comp) -> WAIVED / PAID
 *   - cancel         : reject the registration -> CANCELED
 * The decision is always written to the audit trail.
 */
class ResolveReview extends Action
{
    use Queueable;

    public $name = 'Resolve Review';

    public function handle(ActionFields $fields, Collection $models): ActionResponse
    {
        $actor = Auth::user();
        $actorLabel = $actor ? ($actor->name.' (#'.$actor->getKey().')') : 'unknown';

        $resolution = $fields->resolution;
        $note = $fields->note;

        $done = 0;
        $skipped = 0;

        foreach ($models as $registration) {
            /** @var CampRegistration $registration */
            if ($registration->payment_status !== 'REVIEW_REQUIRED') {
                $skipped++;

                continue;
            }

            $price = (int) ($registration->event_price_cents
                ?? $registration->amount_due_cents
                ?? 0);

            try {
                // D1 has no interactive transactions (see D1Connection); the single
                // UPDATE below is atomic on its own, audit row follows best-effort.
                switch ($resolution) {
                    case 'authorize_cash':
                        $registration->cash_eligible = true;
                        $registration->payment_method = 'CASH';
                        $registration->payment_status = 'DUE';
                        $registration->amount_due_cents = $price;
                        $registration->amount_paid_cents = 0;
                        break;

                    case 'waive':
                        $registration->fee_waived = true;
                        $registration->payment_method = 'WAIVED';
                        $registration->payment_status = 'PAID';
                        $registration->amount_due_cents = 0;
                        break;

                    case 'cancel':
                        $registration->payment_status = 'CANCELED';
                        break;
                }

                $registration->save();

                $this->recordEvent($registration->id, 'review_resolved', null, $actorLabel, [
                    'source' => 'nova:resolve_review',
                    'resolution' => $resolution,
                    'note' => $note,
                ]);
                $done++;
            } catch (\Throwable $e) {
                Log::error('ResolveReview failed', [
                    'registration_id' => $registration->id,
                    'error' => $e->getMessage(),
                ]);

                return ActionResponse::danger('Failed to resolve registration #'.$registration->id.'.');
            }
        }

        $msg = "Resolved {$done} registration(s) as “{$resolution}”.";
        if ($skipped > 0) {
            $msg .= " Skipped {$skipped} (not in review).";
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
        return [
            Select::make('Resolution')
                ->options([
                    'authorize_cash' => 'Authorize cash (CASH / DUE)',
                    'waive' => 'Waive fee (WAIVED / PAID)',
                    'cancel' => 'Cancel registration (CANCELED)',
                ])
                ->rules('required')
                ->displayUsingLabels(),

            Textarea::make('Note')
                ->nullable()
                ->help('Optional reason, recorded in the audit trail.'),
        ];
    }
}
