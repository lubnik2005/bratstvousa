<?php

namespace App\Nova;

use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Image;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Slug;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Trix;
use Laravel\Nova\Http\Requests\NovaRequest;

class GeneralEvent extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\GeneralEvent>
     */
    public static $model = \App\Models\GeneralEvent::class;

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
     * @return array<int, \Laravel\Nova\Fields\Field>
     */
    public function fields(NovaRequest $request): array
    {

        return [
            ID::make()->sortable(),
            Text::make('Title')->rules('required')->required(),
            Text::make('Comment')->help('This is a fields for admins. If there are a lot of events with the same type of comment, it may be worth it to crate a seperate resource just for that event type.'),
            Slug::make('Slug')->from('title'),
            Text::make('Description'),
            Date::make('Start At'),
            Select::make('Region')->options(['all' => 'Все', 'central' => 'Центральный регион', 'east' => 'Восточный регион', 'california' => 'Калифорнийский регион', 'north-east' => 'Северо-Западный регион']),
            Date::make('End At'),
            // Images::make('Featured Image', 'featured_image'),//->croppable(true),//->disk('upfiles'),
            // Images::make('Main image', 'main') // second parameter is the media collection name
            // ->conversionOnIndexView('thumb') // conversion used to display the image
            // ->croppingConfigs(['aspectRatio' => 16/9])->mustCrop(), // validation rules
            Image::make('Featured Event')->disk('upfiles'),
            Image::make('Thumbnail')->disk('upfiles'),
            Trix::make('Content')->withFiles('upfiles'),
        ];
    }

    /**
     * Get the cards available for the resource.
     *
     * @return array<int, \Laravel\Nova\Card>
     */
    public function cards(NovaRequest $request): array
    {
        return [];
    }

    /**
     * Get the filters available for the resource.
     *
     * @return array<int, \Laravel\Nova\Filters\Filter>
     */
    public function filters(NovaRequest $request): array
    {
        return [];
    }

    /**
     * Get the lenses available for the resource.
     *
     * @return array<int, \Laravel\Nova\Lenses\Lens>
     */
    public function lenses(NovaRequest $request): array
    {
        return [];
    }

    /**
     * Get the actions available for the resource.
     *
     * @return array<int, \Laravel\Nova\Actions\Action>
     */
    public function actions(NovaRequest $request): array
    {
        return [];
    }
}
