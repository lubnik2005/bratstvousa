<?php

namespace App\Nova\Paradise;

use App\Nova\Resource;
use Laravel\Nova\Actions\ExportAsCsv;
use Laravel\Nova\Fields\Badge;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Number;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

class Reservation extends Resource
{
    /**
     * @var class-string<\App\Models\Paradise\Reservation>
     */
    public static $model = \App\Models\Paradise\Reservation::class;

    public static $title = 'confirmation_code';

    public static $search = [
        'id', 'first_name', 'last_name', 'email', 'confirmation_code', 'stripe_payment_intent',
    ];

    public static $group = 'Camp Paradise';

    public static function uriKey(): string
    {
        return 'paradise-reservations';
    }

    public static $indexDefaultOrder = [
        'created_at' => 'desc',
    ];

    public static array $statuses = [
        'held' => 'Held',
        'confirmed' => 'Confirmed',
        'cancelled' => 'Cancelled',
        'refunded' => 'Refunded',
    ];

    public static array $sexes = [
        'm' => 'Male',
        'f' => 'Female',
    ];

    public static function label(): string
    {
        return 'Paradise Reservations';
    }

    public function fields(NovaRequest $request): array
    {
        return [
            ID::make()->sortable(),

            Text::make('Code', 'confirmation_code')
                ->sortable()
                ->exceptOnForms(),

            Text::make('First Name', 'first_name')
                ->sortable()
                ->rules('required', 'max:255'),

            Text::make('Last Name', 'last_name')
                ->sortable()
                ->rules('required', 'max:255'),

            Badge::make('Status', 'status')->map([
                'held' => 'warning',
                'confirmed' => 'success',
                'cancelled' => 'danger',
                'refunded' => 'info',
            ])->labels(self::$statuses)->sortable()->exceptOnForms(),

            Select::make('Status', 'status')
                ->options(self::$statuses)
                ->displayUsingLabels()
                ->onlyOnForms()
                ->rules('required'),

            Text::make('Email')
                ->hideFromIndex()
                ->rules('nullable', 'email', 'max:255'),

            Select::make('Sex')
                ->options(self::$sexes)
                ->displayUsingLabels()
                ->hideFromIndex(),

            Number::make('Price', 'price')
                ->hideFromIndex()
                ->help('Price in cents.'),

            BelongsTo::make('Event', 'event', Event::class)->nullable()->sortable(),
            BelongsTo::make('Room', 'room', Room::class)->nullable()->hideFromIndex(),
            BelongsTo::make('Bed', 'cot', Cot::class)->nullable()->hideFromIndex(),

            DateTime::make('Held Until', 'held_until')->onlyOnDetail(),
            DateTime::make('Paid At', 'paid_at')->exceptOnForms(),

            Text::make('Stripe Payment', 'stripe_payment_intent')
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
        return [
            new Filters\ReservationStatus,
        ];
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
