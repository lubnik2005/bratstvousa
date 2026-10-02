<?php

namespace App\Nova\Paradise;

use App\Nova\Resource;
use Laravel\Nova\Actions\ExportAsCsv;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Query\Search\SearchableRelation;

class Cot extends Resource
{
    /**
     * @var class-string<\App\Models\Paradise\Cot>
     */
    public static $model = \App\Models\Paradise\Cot::class;

    // Accessor on the model: "Lodge 300 Room 301 · Cot 1" (bed names repeat across rooms).
    public static $title = 'title';

    public static $search = ['id', 'description'];

    public static $with = ['room'];

    public static $group = 'Camp Paradise';

    public static $relatableSearchResults = 25;

    public static $perPageOptions = [25, 50, 100];

    public static $perPageViaRelationshipOptions = [25, 50, 100];

    /**
     * Let bed pickers/search match on the room name too (e.g. "Lodge 300").
     */
    public static function searchableColumns(): array
    {
        return ['id', 'description', new SearchableRelation('room', 'name')];
    }

    /**
     * Eager-load the room so dropdown labels don't cost one D1 query per bed.
     */
    public static function relatableQuery(NovaRequest $request, $query)
    {
        return $query->with('room');
    }

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
                ->searchable()
                ->sortable(),

            Text::make('Description')
                ->rules('nullable', 'max:255'),

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
        return [ExportAsCsv::make()->withTypeSelector()->nameable()];
    }
}
