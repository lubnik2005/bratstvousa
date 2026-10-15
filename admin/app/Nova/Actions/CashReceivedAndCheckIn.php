<?php

namespace App\Nova\Actions;

use App\Models\CampRegistration;
use App\Services\CampCheckInService;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Collection;
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
        $done = 0;
        $skipped = 0;

        foreach ($models as $registration) {
            /** @var CampRegistration $registration */
            $result = app(CampCheckInService::class)->collectCashAndCheckIn($registration, 'nova:cash_received_and_check_in');
            if ($result['ok']) {
                $done++;
            } else {
                $skipped++;
            }
        }

        $msg = "Collected cash + checked in {$done} attendee(s).";
        if ($skipped > 0) {
            $msg .= " Skipped {$skipped} (not in a collectable state).";
        }

        return ActionResponse::message($msg);
    }

    /**
     * @return array<int, \Laravel\Nova\Fields\Field>
     */
    public function fields(NovaRequest $request): array
    {
        return [];
    }
}
