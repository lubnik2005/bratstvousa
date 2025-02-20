<?php

namespace App\Nova;

use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\Email;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\KeyValue;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Actions\ExportAsCsv;

class FormSubmission extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\FormSubmission>
     */
    public static $model = \App\Models\FormSubmission::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'form_name';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'form_name', 'email', 'phone', 'first_name', 'last_name',
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

            Text::make('Form Name', 'form_name')
                ->sortable()
                ->nullable(),

            Email::make('Email')
                ->sortable()
                ->nullable(),

            Text::make('Phone')
                ->sortable()
                ->nullable(),

            Text::make('First Name', 'first_name')
                ->sortable()
                ->nullable(),

            Text::make('Last Name', 'last_name')
                ->sortable()
                ->nullable(),

            Text::make('Middle Name', 'middle_name')
                ->sortable()
                ->nullable(),

            Date::make('Date of Birth', 'date_of_birth')
                ->sortable()
                ->nullable(),

            BelongsTo::make('Church', 'church')
                ->sortable()
                ->nullable(),

            KeyValue::make('Content', 'content')
                ->nullable(),

            DateTime::make('Created At', 'created_at')->exceptOnForms(),

        ];
    }
        public function actions(NovaRequest $request)
    {
        return [ExportAsCsv::make()];
    }

}
