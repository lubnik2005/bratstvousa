<?php

namespace App\Nova\Paradise;

use App\Nova\Resource;
use Laravel\Nova\Actions\ExportAsCsv;
use Laravel\Nova\Fields\Badge;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\Currency;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Number;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

class LedgerEntry extends Resource
{
    public static $model = \App\Models\Paradise\LedgerEntry::class;

    public static $title = 'email';

    public static $search = ['id', 'email', 'zeffy_payment_id', 'note'];

    public static $group = 'Camp Paradise';

    public static $indexDefaultOrder = ['created_at' => 'desc'];

    public static array $kinds = [
        'topup' => 'Top-up',
        'debit' => 'Bed reserved',
        'refund' => 'Refund',
        'reversal' => 'Zeffy reversal',
        'adjustment' => 'Adjustment',
    ];

    public static function uriKey(): string
    {
        return 'paradise-ledger';
    }

    public static function label(): string
    {
        return 'Paradise Wallet Ledger';
    }

    public static function singularLabel(): string
    {
        return 'Ledger Entry';
    }

    public function fields(NovaRequest $request): array
    {
        return [
            ID::make()->sortable(),

            Text::make('Email', 'email')
                ->sortable()
                ->rules('required', 'email')
                ->help('Camper account email. The balance is keyed by this address.'),

            Badge::make('Kind', 'kind')
                ->map([
                    'topup' => 'success',
                    'debit' => 'warning',
                    'refund' => 'info',
                    'reversal' => 'danger',
                    'adjustment' => 'info',
                ])
                ->labels(self::$kinds)
                ->sortable()
                ->exceptOnForms(),

            Select::make('Kind', 'kind')
                ->options(self::$kinds)
                ->displayUsingLabels()
                ->default('adjustment')
                ->rules('required')
                ->onlyOnForms(),

            Currency::make('Amount', fn () => $this->amount_cents / 100)
                ->currency('USD')
                ->exceptOnForms(),

            Number::make('Amount (cents)', 'amount_cents')
                ->rules('required', 'integer')
                ->help('Positive adds funds, negative removes funds. 1000 = $10.00')
                ->onlyOnForms(),

            Text::make('Note', 'note')->nullable(),

            Text::make('Zeffy Payment ID', 'zeffy_payment_id')->onlyOnDetail(),

            BelongsTo::make('Camper', 'attendee', Attendee::class)
                ->nullable()
                ->searchable()
                ->hideFromIndex(),

            BelongsTo::make('Event', 'event', Event::class)
                ->nullable()
                ->searchable(),

            BelongsTo::make('Reservation', 'reservation', Reservation::class)
                ->nullable()
                ->searchable()
                ->hideFromIndex(),

            DateTime::make('Created', 'created_at')->sortable()->exceptOnForms(),
        ];
    }

    public function cards(NovaRequest $request): array
    {
        return [];
    }

    public function filters(NovaRequest $request): array
    {
        return [new Filters\LedgerKind];
    }

    public function lenses(NovaRequest $request): array
    {
        return [];
    }

    public function actions(NovaRequest $request): array
    {
        return [ExportAsCsv::make()->withTypeSelector()->nameable()];
    }
}
