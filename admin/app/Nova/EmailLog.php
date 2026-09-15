<?php

namespace App\Nova;

use Laravel\Nova\Actions\ExportAsCsv;
use Laravel\Nova\Fields\Badge;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Number;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Textarea;
use Laravel\Nova\Http\Requests\NovaRequest;

class EmailLog extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\EmailLog>
     */
    public static $model = \App\Models\EmailLog::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'to_email';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id', 'to_email', 'subject',
    ];

    /**
     * The logical group associated with the resource.
     *
     * @var string
     */
    public static $group = 'Camp';

    /**
     * Default ordering: newest first.
     *
     * @var array<string, string>
     */
    public static $indexDefaultOrder = [
        'created_at' => 'desc',
    ];

    /**
     * The possible statuses.
     *
     * @var array<string, string>
     */
    public static array $statuses = [
        'sent' => 'Sent',
        'failed' => 'Failed',
    ];

    /**
     * Get the displayable label of the resource.
     */
    public static function label(): string
    {
        return 'Email Log';
    }

    /**
     * Rows are written by the app / retry job, not by hand.
     */
    public static function authorizedToCreate(\Illuminate\Http\Request $request): bool
    {
        return false;
    }

    /**
     * Get the fields displayed by the resource.
     *
     * @return array<int, \Laravel\Nova\Fields\Field>
     */
    public function fields(NovaRequest $request): array
    {
        return [

            ID::make()->sortable(),

            Badge::make('Status', 'status')->map([
                'sent' => 'success',
                'failed' => 'danger',
            ])->labels(self::$statuses)->sortable(),

            Text::make('To', 'to_email')
                ->sortable(),

            Text::make('Subject', 'subject'),

            Number::make('Attempts', 'attempts')
                ->sortable(),

            Textarea::make('Last Error', 'last_error')
                ->hideFromIndex(),

            DateTime::make('Created', 'created_at')
                ->sortable()
                ->exceptOnForms(),
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
        return [
            new Filters\EmailLogStatus,
        ];
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
