<?php

namespace App\Nova;

use App\Nova\Actions\DeleteCheckInRecords;
use App\Nova\Fields\SafeBadge;
use Laravel\Nova\Actions\ExportAsCsv;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

class CampCheckInRecord extends Resource
{
    public static $model = \App\Models\CampCheckInRecord::class;

    public static $title = 'id';

    public static $search = [
        'id', 'checked_in_by', 'source', 'note', 'zeffy_ticket_id', 'zeffy_payment_id',
    ];

    public static $group = 'Camp';

    public static $indexDefaultOrder = [
        'checked_in_at' => 'desc',
    ];

    public static function label(): string
    {
        return 'Check-In Records';
    }

    public static function authorizedToCreate(\Illuminate\Http\Request $request): bool
    {
        return false;
    }

    public function fields(NovaRequest $request): array
    {
        return [
            ID::make()->sortable(),

            BelongsTo::make('Registration', 'registration', CampRegistration::class)
                ->sortable(),

            Text::make('Attendee', function (): string {
                return trim($this->registration?->first_name.' '.$this->registration?->last_name) ?: 'Unknown';
            })->onlyOnIndex(),

            Text::make('Registration Code', function (): string {
                return $this->registration?->confirmation_code ?: 'Not recorded';
            })->onlyOnIndex(),

            DateTime::make('Checked In', 'checked_in_at')
                ->sortable(),

            Text::make('Staff', 'checked_in_by')
                ->sortable(),

            SafeBadge::make('Entry', 'is_repeat')
                ->map([
                    0 => 'success',
                    1 => 'warning',
                ])
                ->labels([
                    0 => 'First entry',
                    1 => 'Repeat entry',
                ]),

            Text::make('Source', 'source')
                ->sortable(),

            Text::make('Note', 'note')
                ->hideFromIndex(),

            Text::make('Zeffy Ticket ID', 'zeffy_ticket_id')
                ->onlyOnDetail(),

            Text::make('Zeffy Payment ID', 'zeffy_payment_id')
                ->onlyOnDetail(),

            Text::make('Request ID', 'request_id')
                ->onlyOnDetail(),
        ];
    }

    public function filters(NovaRequest $request): array
    {
        return [
            new Filters\CampCheckInEntryType,
        ];
    }

    public function actions(NovaRequest $request): array
    {
        return [
            ExportAsCsv::make(),
            DeleteCheckInRecords::make(),
        ];
    }
}
