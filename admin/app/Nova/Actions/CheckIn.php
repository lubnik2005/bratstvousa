<?php

namespace App\Nova\Actions;

use App\Models\CampRegistration;
use App\Services\CampCheckInService;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Laravel\Nova\Actions\Action;
use Laravel\Nova\Actions\ActionResponse;
use Laravel\Nova\Fields\ActionFields;
use Laravel\Nova\Http\Requests\NovaRequest;

/**
 * Check an attendee in WITHOUT collecting cash (spec §24 Cases A & C).
 *
 * Use this for attendees who already satisfied payment — paid online (ONLINE /
 * PAID) or whose cash was already collected elsewhere (CASH / PAID). It does
 * NOT touch payment fields. Attendees who still owe money (DUE / PARTIAL /
 * REVIEW_REQUIRED / PENDING) are skipped so we
 * never silently admit an unpaid attendee (spec §8/§16).
 */
class CheckIn extends Action
{
    use Queueable;

    public $name = 'Check In';

    public function handle(ActionFields $fields, Collection $models): ActionResponse
    {
        $done = 0;
        $alreadyIn = 0;
        $blocked = 0;

        foreach ($models as $registration) {
            /** @var CampRegistration $registration */
            $result = app(CampCheckInService::class)->checkIn($registration, 'nova:check_in', (string) Str::uuid());
            if ($result['code'] === 'already_checked_in') {
                $alreadyIn++;

                continue;
            }
            if ($result['code'] === 'payment_not_paid') {
                $blocked++;

                continue;
            }
            if ($result['ok']) {
                $done++;
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
     * @return array<int, \Laravel\Nova\Fields\Field>
     */
    public function fields(NovaRequest $request): array
    {
        return [];
    }
}
