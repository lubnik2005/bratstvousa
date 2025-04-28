<?php

namespace App\Nova;

use Illuminate\Http\Request;
use Laravel\Nova\Actions\ExportAsCsv;
use Laravel\Nova\Fields\File;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Tag;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

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
        $disk = config('filesystems.default');
        return [
            ID::make()->sortable(),
            Text::make('Name'),
            Tag::make('Categories', 'categories', ChildrensFileCategory::class),
            Select::make('Category')->options([
                'all' => 'Все',
                'preteen-homework' => 'Для занятий с детьми и подростками',
                'seminary' => 'Библейские курсы для подростков',
                'children' => 'Для детей',
                'preteen' => 'Для подростков',
                'preteen-bible-school-course-material' => 'Для курсов и семинаров',
                'children-camp' => 'Детский лагерь',
                'preteen-camp' => 'Подростковый лагерь',
            ])->nullable(),
            File::make('File', 'path', $disk)->storeOriginalName('name')->storeSize('size')->path('/upfiles/file'),
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
        return [ExportAsCsv::make()];
    }
}
