<?php

namespace App\Nova\Paradise;

use App\Nova\Resource;
use Laravel\Nova\Actions\ExportAsCsv;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Fields\Code;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

class Form extends Resource
{
    /**
     * @var class-string<\App\Models\Paradise\Form>
     */
    public static $model = \App\Models\Paradise\Form::class;

    public static $title = 'name';

    public static $search = ['id', 'name'];

    public static $group = 'Camp Paradise';

    public static function uriKey(): string
    {
        return 'paradise-forms';
    }

    public static function label(): string
    {
        return 'Paradise Forms';
    }

    public function fields(NovaRequest $request): array
    {
        return [
            ID::make()->sortable(),

            Text::make('Name')
                ->sortable()
                ->rules('required', 'max:255'),

            Boolean::make('Required')
                ->sortable(),

            Code::make('Questions')
                ->json()
                ->hideFromIndex()
                ->help('JSON array of the waiver/consent questions shown at registration.'),
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
