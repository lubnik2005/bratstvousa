<?php

namespace App\Nova\Paradise;

use App\Nova\Resource;
use Laravel\Nova\Actions\ExportAsCsv;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Number;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Textarea;
use Laravel\Nova\Fields\URL;
use Laravel\Nova\Http\Requests\NovaRequest;

class Event extends Resource
{
    /**
     * @var class-string<\App\Models\Paradise\Event>
     */
    public static $model = \App\Models\Paradise\Event::class;

    public static $title = 'name';

    public static $search = ['id', 'name', 'description'];

    public static $group = 'Camp Paradise';

    public static function uriKey(): string
    {
        return 'paradise-events';
    }

    public static array $statuses = [
        'draft' => 'Draft',
        'published' => 'Published',
    ];

    public static function label(): string
    {
        return 'Paradise Events';
    }

    public function fields(NovaRequest $request): array
    {
        return [
            ID::make()->sortable(),

            Text::make('Name')
                ->sortable()
                ->rules('required', 'max:255'),

            Select::make('Status')
                ->options(self::$statuses)
                ->displayUsingLabels()
                ->rules('required')
                ->sortable(),

            DateTime::make('Start On', 'start_on')->hideFromIndex(),
            DateTime::make('End On', 'end_on')->hideFromIndex(),
            DateTime::make('Registration Start', 'registration_start_at')->hideFromIndex(),
            DateTime::make('Registration End', 'registration_end_at')->hideFromIndex(),

            Number::make('Refund %', 'refund_percentage')
                ->min(0)->max(100)
                ->rules('nullable', 'integer', 'min:0', 'max:100')
                ->help('Percentage of the price refunded on cancellation.'),

            DateTime::make('Refunds Available Until', 'refunds_available_until')->hideFromIndex(),

            Textarea::make('Description')->hideFromIndex(),

            Text::make('Zeffy Campaign ID', 'zeffy_campaign_id')
                ->nullable()
                ->hideFromIndex()
                ->help('campaign_id from the Camp Paradise Zeffy ticketing campaign. Payments for this campaign grant tickets for this event.'),

            URL::make('Zeffy Ticketing URL', 'zeffy_ticketing_url')
                ->nullable()
                ->hideFromIndex()
                ->help('Public Zeffy ticketing page shown to campers as "Buy a ticket on Zeffy".'),
        ];
    }

    public function cards(NovaRequest $request): array
    {
        return [];
    }

    public function filters(NovaRequest $request): array
    {
        return [];
    }

    public function lenses(NovaRequest $request): array
    {
        return [];
    }

    public function actions(NovaRequest $request): array
    {
        return [ExportAsCsv::make()];
    }
}
