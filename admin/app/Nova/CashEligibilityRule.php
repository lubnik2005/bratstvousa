<?php

namespace App\Nova;

use Laravel\Nova\Actions\ExportAsCsv;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Fields\Currency;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

class CashEligibilityRule extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\CashEligibilityRule>
     */
    public static $model = \App\Models\CashEligibilityRule::class;

    /**
     * The single value that should be used to represent the resource.
     *
     * @var string
     */
    public static $title = 'discount_code';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id', 'event_slug', 'discount_code',
    ];

    /**
     * The logical group associated with the resource.
     *
     * @var string
     */
    public static $group = 'Camp';

    /**
     * Get the fields displayed by the resource.
     *
     * @return array<int, \Laravel\Nova\Fields\Field>
     */
    public function fields(NovaRequest $request): array
    {
        return [

            ID::make()->sortable(),

            Select::make('Scope', 'scope_type')
                ->options(['church' => 'Church'])
                ->default('church')
                ->displayUsingLabels()
                ->rules('required')
                ->help('Which dimension this rule authorizes. Currently only per-church rules are supported.'),

            \Laravel\Nova\Fields\BelongsTo::make('Church', 'church', Church::class)
                ->searchable()
                ->nullable()
                ->help('The church/group this rule applies to. Must match the church selected on the registration form (by id).'),

            Text::make('Event Slug', 'event_slug')
                ->sortable()
                ->rules('required', 'max:255')
                ->help('e.g. "osennii-molodeznyi-lager-szr-2026". One rule per church per event.'),

            Currency::make('Amount', 'amount_cents')
                ->asMinorUnits()
                ->sortable()
                ->rules('required')
                ->help('What the registrant pays on Zeffy. $0 = cash at the door: the registrant gets a $0 ticket and pays the full camp price in cash at check-in. Any other amount (e.g. $175) = the registrant pays that amount online and is NOT cash-eligible (the church covers the rest directly).'),

            Text::make('Discount Code', 'discount_code')
                ->rules('nullable', 'max:255')
                ->help('Shared Zeffy 100%-off code for this group (reference only — never proof of eligibility). A shared code = multiple rows with the same value.'),

            Text::make('Zeffy Campaign Id', 'zeffy_campaign_id')
                ->rules('nullable', 'max:255')
                ->hideFromIndex()
                ->help('The Zeffy campaign (ticketing form) UUID for this event. When set on any active rule for the event, payments from other Zeffy campaigns are flagged "Review required" instead of being accepted. Copy it from a Zeffy Payment\'s raw JSON (campaign_id).'),

            Boolean::make('Active')
                ->sortable()
                ->help('Only active rules grant cash eligibility at registration time.'),
        ];
    }

    /**
     * Get the cards available for the resource.
     *
     * @return array<int, \Laravel\Nova\Card>
     */
    public function cards(NovaRequest $request): array
    {
        return [];
    }

    /**
     * Get the filters available for the resource.
     *
     * @return array<int, \Laravel\Nova\Filters\Filter>
     */
    public function filters(NovaRequest $request): array
    {
        return [];
    }

    /**
     * Get the lenses available for the resource.
     *
     * @return array<int, \Laravel\Nova\Lenses\Lens>
     */
    public function lenses(NovaRequest $request): array
    {
        return [];
    }

    /**
     * Get the actions available for the resource.
     *
     * @return array<int, \Laravel\Nova\Actions\Action>
     */
    public function actions(NovaRequest $request): array
    {
        return [ExportAsCsv::make()];
    }
}
