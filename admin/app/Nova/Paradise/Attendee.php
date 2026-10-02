<?php

namespace App\Nova\Paradise;

use App\Nova\Resource;
use Laravel\Nova\Actions\ExportAsCsv;
use Laravel\Nova\Fields\Currency;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\HasMany;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

class Attendee extends Resource
{
    public static $model = \App\Models\Paradise\Attendee::class;

    public static $title = 'email';

    public static $search = ['id', 'email', 'first_name', 'last_name'];

    public static $group = 'Camp Paradise';

    public static $indexDefaultOrder = ['created_at' => 'desc'];

    public static function uriKey(): string
    {
        return 'paradise-attendees';
    }

    public static function label(): string
    {
        return 'Paradise Campers';
    }

    public static function singularLabel(): string
    {
        return 'Paradise Camper';
    }

    public function fields(NovaRequest $request): array
    {
        return [
            ID::make()->sortable(),

            Text::make('Email', 'email')->sortable()->exceptOnForms(),

            Text::make('First Name', 'first_name')->sortable()->exceptOnForms(),

            Text::make('Last Name', 'last_name')->sortable()->exceptOnForms(),

            Select::make('Sex', 'sex')
                ->options(['m' => 'Male', 'f' => 'Female'])
                ->displayUsingLabels()
                ->sortable()
                ->exceptOnForms(),

            Currency::make('Balance', function () {
                return $this->balanceCents() / 100;
            })->currency('USD')->exceptOnForms(),

            DateTime::make('Verified At', 'verified_at')->sortable()->exceptOnForms(),

            DateTime::make('Last Login At', 'last_login_at')->sortable()->exceptOnForms(),

            DateTime::make('Created', 'created_at')->sortable()->exceptOnForms(),

            HasMany::make('Reservations', 'reservations', Reservation::class),

            HasMany::make('Ledger', 'ledgerEntries', LedgerEntry::class),

            DateTime::make('Updated', 'updated_at')->onlyOnDetail(),
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
