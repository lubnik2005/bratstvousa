<?php

namespace App\Nova;

use Illuminate\Http\Request;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\URL;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Http\Requests\NovaRequest;

class Church extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\ >
     */
    public static $model = \App\Models\Church::class;

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

            Text::make('State')
                ->sortable()
                ->rules('required', 'max:255'),

            Text::make('City')
                ->sortable()
                ->rules('required', 'max:255'),

            Text::make('Name Line 1')
                ->sortable()
                ->rules('required', 'max:255'),

            Text::make('Name Line 2')
                ->rules('nullable', 'max:255'),

            Select::make('Region')
                ->options([
                    'central' => 'Central',
                    'east' => 'East',
                    'california' => 'California',
                    'north-west' => 'North-West',
                    // Add more regions if necessary
                ])
                ->rules('required'),

            Text::make('Address Line 1')
                ->sortable()
                ->rules('required', 'max:255'),

            Text::make('Address Line 2')
                ->rules('nullable', 'max:255'),

            Text::make('Contact First Name')
                ->rules('required', 'max:255'),

            Text::make('Contact Last Name')
                ->rules('required', 'max:255'),

            Text::make('Phone')
                ->rules('required', 'max:15'),

            URL::make('Youtube')
                ->rules('nullable', 'url'),

            // Timestamps are automatically handled by Nova, no need to add them manually
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
