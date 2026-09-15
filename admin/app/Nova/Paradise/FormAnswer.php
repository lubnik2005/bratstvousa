<?php

namespace App\Nova\Paradise;

use App\Nova\Resource;
use Laravel\Nova\Actions\ExportAsCsv;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\Code;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

class FormAnswer extends Resource
{
    /**
     * @var class-string<\App\Models\Paradise\FormAnswer>
     */
    public static $model = \App\Models\Paradise\FormAnswer::class;

    public static $title = 'email';

    public static $search = ['id', 'email'];

    public static $group = 'Camp Paradise';

    public static function uriKey(): string
    {
        return 'paradise-form-answers';
    }

    public static $indexDefaultOrder = [
        'created_at' => 'desc',
    ];

    public static function label(): string
    {
        return 'Paradise Form Answers';
    }

    public function fields(NovaRequest $request): array
    {
        return [
            ID::make()->sortable(),

            Text::make('Email')
                ->sortable()
                ->rules('nullable', 'email', 'max:255'),

            BelongsTo::make('Form', 'form', Form::class)->nullable()->sortable(),
            BelongsTo::make('Event', 'event', Event::class)->nullable()->hideFromIndex(),
            BelongsTo::make('Reservation', 'reservation', Reservation::class)->nullable()->hideFromIndex(),

            Code::make('Answers')
                ->json()
                ->onlyOnDetail(),

            DateTime::make('Signed On', 'signed_on')
                ->exceptOnForms(),
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
