<?php

namespace App\Nova;

use Laravel\Nova\Actions\ExportAsCsv;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

class YouthLeader extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\YouthLeader>
     */
    public static $model = \App\Models\YouthLeader::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'name';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id', 'name', 'city', 'email', 'phone',
    ];

    /**
     * The logical group associated with the resource.
     *
     * @var string
     */
    public static $group = 'Camp';

    /**
     * Get the fields displayed by the resource.
     *
     * @return array<int, \Laravel\Nova\Fields\Field>
     */
    public function fields(NovaRequest $request): array
    {
        return [

            ID::make()->sortable(),

            Text::make('Name')
                ->sortable()
                ->rules('required', 'max:255'),

            Text::make('City')
                ->sortable()
                ->rules('nullable', 'max:255')
                ->help('City / location label (e.g. "Vancouver: Hazel Dell"). Name + city may be shown publicly.'),

            Text::make('Email')
                ->rules('nullable', 'email', 'max:255')
                ->help('Server-side only — never exposed to the public. Used to send approval-request emails.'),

            Text::make('Phone')
                ->rules('nullable', 'max:255')
                ->help('Server-side only — never exposed to the public.'),

            Boolean::make('Active')
                ->sortable()
                ->help('Only active leaders appear in the public camp registration dropdown.'),
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
        return [ExportAsCsv::make()];
    }
}
