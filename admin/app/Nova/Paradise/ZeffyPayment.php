<?php

namespace App\Nova\Paradise;

use App\Nova\Resource;
use Laravel\Nova\Actions\ExportAsCsv;
use Laravel\Nova\Fields\Badge;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\Code;
use Laravel\Nova\Fields\Currency;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

class ZeffyPayment extends Resource
{
    public static $model = \App\Models\Paradise\ZeffyPayment::class;

    public static $title = 'zeffy_payment_id';

    public static $search = ['id', 'zeffy_payment_id', 'buyer_email', 'buyer_last_name'];

    public static $group = 'Camp Paradise';

    public static $indexDefaultOrder = ['created_at' => 'desc'];

    public static array $matchStatuses = [
        'matched' => 'Matched',
        'unmatched' => 'Unmatched',
        'refunded' => 'Refunded',
    ];

    public static function uriKey(): string
    {
        return 'paradise-zeffy-payments';
    }

    public static function label(): string
    {
        return 'Paradise Zeffy Payments';
    }

    public static function singularLabel(): string
    {
        return 'Zeffy Payment';
    }

    public function fields(NovaRequest $request): array
    {
        return [
            ID::make()->sortable(),

            Text::make('Zeffy Payment ID', 'zeffy_payment_id')
                ->sortable()
                ->exceptOnForms(),

            Badge::make('Status', 'status')
                ->map([
                    'succeeded' => 'success',
                    'pending' => 'warning',
                    'failed' => 'danger',
                    'unknown' => 'warning',
                ])
                ->sortable()
                ->exceptOnForms(),

            Currency::make('Amount', fn () => ($this->amount ?? 0) / 100)
                ->currency('USD')
                ->exceptOnForms(),

            Text::make('Buyer Email', 'buyer_email')
                ->sortable()
                ->rules('nullable', 'email')
                ->help('Fix this to the camper\'s account email, then run "Apply to wallet".'),

            Text::make('Buyer First Name', 'buyer_first_name')
                ->nullable()
                ->hideFromIndex(),

            Text::make('Buyer Last Name', 'buyer_last_name')
                ->nullable()
                ->hideFromIndex(),

            Badge::make('Match Status', 'match_status')
                ->map([
                    'matched' => 'success',
                    'unmatched' => 'warning',
                    'refunded' => 'danger',
                ])
                ->labels(self::$matchStatuses)
                ->sortable()
                ->exceptOnForms(),

            Select::make('Match Status', 'match_status')
                ->options(self::$matchStatuses)
                ->displayUsingLabels()
                ->rules('required')
                ->onlyOnForms(),

            Currency::make('Credited', fn () => ($this->credited_cents ?? 0) / 100)
                ->currency('USD')
                ->exceptOnForms(),

            Text::make('Campaign ID', 'campaign_id')
                ->readonly()
                ->hideFromIndex(),

            BelongsTo::make('Event', 'event', Event::class)
                ->nullable()
                ->searchable()
                ->sortable(),

            Code::make('Payload', 'raw_json')
                ->json()
                ->onlyOnDetail(),

            DateTime::make('Created', 'created_at')
                ->sortable()
                ->exceptOnForms(),
        ];
    }

    public function cards(NovaRequest $request): array
    {
        return [];
    }

    public function filters(NovaRequest $request): array
    {
        return [new Filters\ZeffyMatchStatus];
    }

    public function lenses(NovaRequest $request): array
    {
        return [];
    }

    public function actions(NovaRequest $request): array
    {
        return [
            ExportAsCsv::make(),
            new Actions\ApplyZeffyPaymentToWallet,
        ];
    }
}
