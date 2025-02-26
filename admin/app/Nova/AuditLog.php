<?php

namespace App\Nova;

use Laravel\Nova\Fields\Code;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Number;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\URL;
use Laravel\Nova\Http\Requests\NovaRequest;
use OwenIt\Auditing\Models\Audit;

class AuditLog extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\AuditLog>
     */
    public static $model = Audit::class;

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

            Text::make('User Type', 'user_type')
                ->sortable()
                ->nullable(),

            Number::make('User ID', 'user_id')
                ->sortable()
                ->nullable(),

            Text::make('Event', 'event')
                ->sortable()
                ->rules('required', 'max:255'),

            Text::make('Auditable Type', 'auditable_type')
                ->sortable()
                ->rules('required', 'max:255'),

            Number::make('Auditable ID', 'auditable_id')
                ->sortable()
                ->rules('required'),

            Code::make('Old Values', 'old_values')
                ->nullable()->json(),

            Code::make('New Values', 'new_values')
                ->nullable()->json(),

            URL::make('URL', 'url')
                ->nullable(),

            URL::make('IP Address', 'ip_address')
                ->nullable(),

            Text::make('User Agent', 'user_agent')
                ->sortable()
                ->nullable(),

            Text::make('Tags', 'tags')
                ->sortable()
                ->nullable(),

            DateTime::make('Created At', 'created_at')
                ->sortable()
                ->readonly(),

            DateTime::make('Updated At', 'updated_at')
                ->sortable()
                ->readonly(),
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
