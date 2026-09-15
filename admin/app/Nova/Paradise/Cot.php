<?php

namespace App\Nova\Paradise;

use App\Nova\Resource;
use Laravel\Nova\Actions\ExportAsCsv;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

class Cot extends Resource
{
    /**
     * @var class-string<\App\Models\Paradise\Cot>
     */
    public static $model = \App\Models\Paradise\Cot::class;

    public static $title = 'description';

    public static $search = ['id', 'description'];

    public static $group = 'Camp Paradise';

    public static function uriKey(): string
    {
        return 'paradise-cots';
    }

    public static function label(): string
    {
        return 'Paradise Beds';
    }

    public function fields(NovaRequest $request): array
    {
        return [
            ID::make()->sortable(),

            BelongsTo::make('Room', 'room', Room::class)
                ->sortable(),

            Text::make('Description')
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
