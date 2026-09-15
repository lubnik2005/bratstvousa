<?php

namespace App\Nova\Paradise;

use App\Nova\Resource;
use Laravel\Nova\Actions\ExportAsCsv;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Number;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

class Room extends Resource
{
    /**
     * @var class-string<\App\Models\Paradise\Room>
     */
    public static $model = \App\Models\Paradise\Room::class;

    public static $title = 'name';

    public static $search = ['id', 'name', 'location'];

    public static $group = 'Camp Paradise';

    public static function uriKey(): string
    {
        return 'paradise-rooms';
    }

    public static array $sexes = [
        'm' => 'Male',
        'f' => 'Female',
        'c' => 'Coed / either',
    ];

    public static array $types = [
        'cabin' => 'Cabin',
        'dorm' => 'Dorm',
        'vip' => 'VIP',
    ];

    public static function label(): string
    {
        return 'Paradise Rooms';
    }

    public function fields(NovaRequest $request): array
    {
        return [
            ID::make()->sortable(),

            Text::make('Name')
                ->sortable()
                ->rules('required', 'max:255'),

            Select::make('Sex')
                ->options(self::$sexes)
                ->displayUsingLabels()
                ->rules('required')
                ->sortable(),

            Select::make('Type')
                ->options(self::$types)
                ->displayUsingLabels()
                ->rules('required')
                ->sortable(),

            Number::make('Size')
                ->rules('nullable', 'integer', 'min:0'),

            Text::make('Location')
                ->hideFromIndex()
                ->rules('nullable', 'max:255'),
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
