<?php

namespace App\Nova\Paradise;

use App\Nova\Resource;
use Laravel\Nova\Actions\ExportAsCsv;
use Laravel\Nova\Fields\Badge;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\Currency;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Textarea;
use Laravel\Nova\Http\Requests\NovaRequest;

class RefundRequest extends Resource
{
    public static $model = \App\Models\Paradise\RefundRequest::class;

    public static $title = 'email';

    public static $search = ['id', 'email', 'note'];

    public static $group = 'Camp Paradise';

    public static $indexDefaultOrder = ['created_at' => 'desc'];

    public static array $statuses = [
        'open' => 'Open',
        'resolved' => 'Resolved',
        'declined' => 'Declined',
    ];

    public static function uriKey(): string
    {
        return 'paradise-refund-requests';
    }

    public static function label(): string
    {
        return 'Paradise Refund Requests';
    }

    public static function singularLabel(): string
    {
        return 'Refund Request';
    }

    public function fields(NovaRequest $request): array
    {
        return [
            ID::make()->sortable(),

            Text::make('Email', 'email')
                ->sortable()
                ->readonly(),

            BelongsTo::make('Camper', 'attendee', Attendee::class)
                ->nullable()
                ->readonly()
                ->sortable(),

            Text::make('Requested', fn () => $this->amount_cents === null
                ? 'Full balance'
                : '$'.number_format($this->amount_cents / 100, 2))
                ->exceptOnForms(),

            Currency::make('Balance at request', fn () => ($this->balance_cents ?? 0) / 100)
                ->currency('USD')
                ->exceptOnForms(),

            Textarea::make('Reason', 'note')
                ->readonly()
                ->alwaysShow(),

            Badge::make('Status', 'status')
                ->map([
                    'open' => 'warning',
                    'resolved' => 'success',
                    'declined' => 'danger',
                ])
                ->labels(self::$statuses)
                ->sortable()
                ->exceptOnForms(),

            Select::make('Status', 'status')
                ->options(self::$statuses)
                ->displayUsingLabels()
                ->rules('required')
                ->help('Issue the refund in Zeffy, add a matching "adjustment" ledger entry, then mark Resolved.')
                ->onlyOnForms(),

            DateTime::make('Created', 'created_at')
                ->sortable()
                ->exceptOnForms(),

            DateTime::make('Updated', 'updated_at')->onlyOnDetail(),
        ];
    }

    public function actions(NovaRequest $request): array
    {
        return [ExportAsCsv::make()];
    }
}
