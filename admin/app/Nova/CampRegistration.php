<?php

namespace App\Nova;

use Laravel\Nova\Actions\ExportAsCsv;
use Laravel\Nova\Fields\Badge;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Number;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

class CampRegistration extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\CampRegistration>
     */
    public static $model = \App\Models\CampRegistration::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'confirmation_code';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id', 'first_name', 'last_name', 'email', 'phone', 'confirmation_code', 'church',
    ];

    /**
     * The logical group associated with the resource.
     *
     * @var string
     */
    public static $group = 'Camp';

    /**
     * Default ordering: newest registrations first.
     *
     * @var array<string, string>
     */
    public static $indexDefaultOrder = [
        'created_at' => 'desc',
    ];

    /**
     * The possible registration statuses.
     *
     * @var array<string, string>
     */
    public static array $statuses = [
        'pending_payment' => 'Pending payment',
        'awaiting_approval' => 'Awaiting approval',
        'approved' => 'Approved',
        'rejected' => 'Rejected',
    ];

    /**
     * The possible payment statuses.
     *
     * @var array<string, string>
     */
    public static array $paymentStatuses = [
        'unpaid' => 'Unpaid',
        'paid' => 'Paid',
    ];

    /**
     * Get the displayable label of the resource.
     */
    public static function label(): string
    {
        return 'Camp Registrations';
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

            Text::make('Code', 'confirmation_code')
                ->sortable()
                ->exceptOnForms()
                ->help('Registration code the registrant enters in Zeffy to reconcile payment.'),

            Text::make('First Name', 'first_name')
                ->sortable()
                ->rules('required', 'max:255'),

            Text::make('Last Name', 'last_name')
                ->sortable()
                ->rules('required', 'max:255'),

            Badge::make('Status', 'status')->map([
                'pending_payment' => 'warning',
                'awaiting_approval' => 'info',
                'approved' => 'success',
                'rejected' => 'danger',
            ])->labels(self::$statuses)->sortable()->exceptOnForms(),

            Select::make('Status', 'status')
                ->options(self::$statuses)
                ->displayUsingLabels()
                ->onlyOnForms()
                ->rules('required'),

            Badge::make('Payment', 'payment_status')->map([
                'unpaid' => 'warning',
                'paid' => 'success',
            ])->labels(self::$paymentStatuses)->sortable()->exceptOnForms(),

            Select::make('Payment', 'payment_status')
                ->options(self::$paymentStatuses)
                ->displayUsingLabels()
                ->onlyOnForms()
                ->rules('required'),

            BelongsTo::make('Youth Leader', 'youthLeader', YouthLeader::class)
                ->nullable()
                ->sortable(),

            Text::make('Church')
                ->hideFromIndex()
                ->rules('nullable', 'max:255'),

            Text::make('Email')
                ->hideFromIndex()
                ->rules('nullable', 'email', 'max:255'),

            Text::make('Phone')
                ->hideFromIndex()
                ->rules('nullable', 'max:255'),

            Number::make('Amount')
                ->hideFromIndex()
                ->rules('nullable', 'integer')
                ->help('Camp fee in dollars.'),

            Text::make('Event', 'event_slug')
                ->hideFromIndex()
                ->rules('required', 'max:255'),

            Text::make('Approved By', 'approved_by')
                ->onlyOnDetail(),

            DateTime::make('Approved At', 'approved_at')
                ->onlyOnDetail(),

            Text::make('Zeffy Payment', 'zeffy_payment_id')
                ->onlyOnDetail()
                ->help('Zeffy payment id linked to this registration (set when payment is reconciled).'),

            DateTime::make('Paid At', 'paid_at')
                ->exceptOnForms()
                ->help('When the Zeffy payment was reconciled.'),

            DateTime::make('Registered', 'created_at')
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
            new Filters\CampRegistrationStatus,
            new Filters\CampRegistrationPaymentStatus,
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
