<?php

namespace App\Nova;

use Laravel\Nova\Actions\ExportAsCsv;
use Laravel\Nova\Fields\Badge;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\Code;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Number;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

class ZeffyPayment extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\ZeffyPayment>
     */
    public static $model = \App\Models\ZeffyPayment::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'zeffy_payment_id';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id', 'zeffy_payment_id', 'confirmation_code', 'buyer_email', 'buyer_first_name', 'buyer_last_name',
    ];

    /**
     * The logical group associated with the resource.
     *
     * @var string
     */
    public static $group = 'Camp';

    /**
     * Default ordering: newest payments first.
     *
     * @var array<string, string>
     */
    public static $indexDefaultOrder = [
        'created_at' => 'desc',
    ];

    /**
     * The possible match statuses.
     *
     * @var array<string, string>
     */
    public static array $matchStatuses = [
        'matched' => 'Matched',
        'unmatched' => 'Unmatched',
        'refunded' => 'Refunded',
    ];

    /**
     * Get the displayable label of the resource.
     */
    public static function label(): string
    {
        return 'Zeffy Payments';
    }

    /**
     * Payments are created by the sync job / webhook, not by hand.
     */
    public static function authorizedToCreate(\Illuminate\Http\Request $request): bool
    {
        return false;
    }

    /**
     * Get the fields displayed by the resource.
     *
     * @return array<int, \Laravel\Nova\Fields\Field>
     */
    public function fields(NovaRequest $request): array
    {
        return [

            ID::make()->sortable(),

            Badge::make('Match', 'match_status')->map([
                'matched' => 'success',
                'unmatched' => 'danger',
                'refunded' => 'warning',
            ])->labels(self::$matchStatuses)->sortable(),

            Text::make('Code', 'confirmation_code')
                ->sortable()
                ->help('CAMP-XXXXX code extracted from the payment, if any.'),

            Text::make('Buyer', function () {
                return trim(($this->buyer_first_name ?? '').' '.($this->buyer_last_name ?? '')) ?: '—';
            }),

            Text::make('Buyer Email', 'buyer_email')
                ->sortable(),

            Number::make('Amount (cents)', 'amount')
                ->help('Zeffy amount in cents.'),

            Text::make('Currency', 'currency')
                ->hideFromIndex(),

            Text::make('Status', 'status')
                ->hideFromIndex(),

            BelongsTo::make('Registration', 'registration', CampRegistration::class)
                ->nullable()
                ->sortable(),

            Text::make('Zeffy Payment Id', 'zeffy_payment_id')
                ->onlyOnDetail(),

            Code::make('Raw', 'raw_json')
                ->json()
                ->onlyOnDetail(),

            DateTime::make('Received', 'created_at')
                ->sortable()
                ->exceptOnForms(),
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
        return [
            new Filters\ZeffyPaymentMatchStatus,
        ];
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
