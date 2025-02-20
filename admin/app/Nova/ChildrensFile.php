<?php

namespace App\Nova;

use Illuminate\Http\Request;
use Laravel\Nova\Fields\File;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Actions\ExportAsCsv;

class ChildrensFile extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\ChildrensFile>
     */
    public static $model = \App\Models\ChildrensFile::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'id';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id',
    ];

    /**
     * Get the fields displayed by the resource.
     *
     * @return array
     */
    public function fields(NovaRequest $request)
    {
        return [
            ID::make()->sortable(),
            Select::make('Category')->options([
                'all' => 'Все',
                'preteen-homework' => 'Для занятий с детьми и подростками',
                'seminary' => 'Библейские курсы для подростков',
                'children' => 'Для детей',
                'preteen' => 'Для подростков',
                'preteen-bible-school-course-material' => 'Для курсов и семинаров',
            ])->nullable(),
            File::make('File', 'path')->storeOriginalName('name')->storeSize('size'),
        ];
    }

    /**
     * Get the cards available for the request.
     *
     * @return array
     */
    public function cards(NovaRequest $request)
    {
        return [];
    }

    /**
     * Get the filters available for the resource.
     *
     * @return array
     */
    public function filters(NovaRequest $request)
    {
        return [];
    }

    /**
     * Get the lenses available for the resource.
     *
     * @return array
     */
    public function lenses(NovaRequest $request)
    {
        return [];
    }

    /**
     * Get the actions available for the resource.
     *
     * @return array
     */
    public function actions(NovaRequest $request)
    {
        return [        ExportAsCsv::make(),];
    }
}
