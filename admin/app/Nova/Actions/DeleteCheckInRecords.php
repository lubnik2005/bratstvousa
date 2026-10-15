<?php

namespace App\Nova\Actions;

use App\Models\CampCheckInRecord;
use App\Services\CampCheckInService;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Collection;
use Laravel\Nova\Actions\Action;
use Laravel\Nova\Actions\ActionResponse;
use Laravel\Nova\Fields\ActionFields;

class DeleteCheckInRecords extends Action
{
    use Queueable;

    public $name = 'Delete Check-In Records';

    public $destructive = true;

    public $confirmText = 'Delete the selected check-in records? This updates the attendee check-in summary but does not change payment or Zeffy data.';

    public $confirmButtonText = 'Delete Records';

    public function handle(ActionFields $fields, Collection $models): ActionResponse
    {
        $deleted = 0;
        $failed = 0;
        $service = app(CampCheckInService::class);

        foreach ($models as $checkIn) {
            /** @var CampCheckInRecord $checkIn */
            if ($service->deleteCheckInRecord($checkIn)) {
                $deleted++;
            } else {
                $failed++;
            }
        }

        $message = "Deleted {$deleted} check-in record(s).";
        if ($failed > 0) {
            $message .= " {$failed} record(s) could not be deleted.";
        }

        return ActionResponse::message($message);
    }
}
