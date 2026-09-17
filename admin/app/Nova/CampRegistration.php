<?php

namespace App\Nova;

use App\Nova\Fields\SafeBadge;
use Laravel\Nova\Actions\ExportAsCsv;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Fields\Currency;
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
     * The possible payment statuses. Legacy lowercase values are kept so
     * un-backfilled rows still render.
     *
     * @var array<string, string>
     */
    public static array $paymentStatuses = [
        'PENDING' => 'Pending',
        'DUE' => 'Cash due',
        'PAID' => 'Paid',
        'REVIEW_REQUIRED' => 'Review required',
        'REFUNDED' => 'Refunded',
        'CANCELED' => 'Canceled',
        // legacy
        'unpaid' => 'Unpaid (legacy)',
        'paid' => 'Paid (legacy)',
    ];

    /**
     * The possible payment methods.
     *
     * @var array<string, string>
     */
    public static array $paymentMethods = [
        'ONLINE' => 'Online',
        'CASH' => 'Cash',
        'WAIVED' => 'Waived',
        'OTHER' => 'Other',
    ];

    /**
     * The possible check-in statuses.
     *
     * @var array<string, string>
     */
    public static array $checkinStatuses = [
        'NOT_CHECKED_IN' => 'Not checked in',
        'CHECKED_IN' => 'Checked in',
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

            SafeBadge::make('Status', 'status')->map([
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

            SafeBadge::make('Payment', 'payment_status')->map([
                'PENDING' => 'warning',
                'DUE' => 'warning',
                'PAID' => 'success',
                'REVIEW_REQUIRED' => 'danger',
                'REFUNDED' => 'info',
                'CANCELED' => 'info',
                'unpaid' => 'warning',
                'paid' => 'success',
            ])->labels(self::$paymentStatuses)->sortable()->exceptOnForms(),

            Select::make('Payment', 'payment_status')
                ->options(self::$paymentStatuses)
                ->displayUsingLabels()
                ->onlyOnForms()
                ->rules('required'),

            SafeBadge::make('Method', 'payment_method')->map([
                'ONLINE' => 'info',
                'CASH' => 'warning',
                'WAIVED' => 'success',
                'OTHER' => 'info',
            ])->labels(self::$paymentMethods)->sortable()->exceptOnForms(),

            Select::make('Method', 'payment_method')
                ->options(self::$paymentMethods)
                ->displayUsingLabels()
                ->nullable()
                ->onlyOnForms(),

            SafeBadge::make('Check-in', 'checkin_status')->map([
                'NOT_CHECKED_IN' => 'warning',
                'CHECKED_IN' => 'success',
            ])->labels(self::$checkinStatuses)->sortable()->exceptOnForms(),

            Select::make('Check-in', 'checkin_status')
                ->options(self::$checkinStatuses)
                ->displayUsingLabels()
                ->onlyOnForms(),

            Boolean::make('Cash Eligible', 'cash_eligible')
                ->sortable()
                ->help('Authorized to pay cash at check-in (a $0 Zeffy checkout). Set at registration from the cash eligibility rules.'),

            Boolean::make('Fee Waived', 'fee_waived')
                ->hideFromIndex()
                ->help('Legitimately free admission (staff/scholarship/comp).'),

            BelongsTo::make('Youth Leader', 'youthLeader', YouthLeader::class)
                ->nullable()
                ->sortable(),

            BelongsTo::make('Church (linked)', 'churchModel', Church::class)
                ->nullable()
                ->hideFromIndex()
                ->help('Real church record captured at registration (drives cash eligibility).'),

            Text::make('Church')
                ->hideFromIndex()
                ->rules('nullable', 'max:255')
                ->help('Free-text church label as entered by the registrant.'),

            Text::make('Email')
                ->hideFromIndex()
                ->rules('nullable', 'email', 'max:255'),

            Text::make('Phone')
                ->hideFromIndex()
                ->rules('nullable', 'max:255'),

            Number::make('Amount')
                ->hideFromIndex()
                ->onlyOnDetail()
                ->rules('nullable', 'integer')
                ->help('Legacy camp fee in dollars (kept for back-compat; new logic uses cents).'),

            Currency::make('Event Price', 'event_price_cents')
                ->asMinorUnits()
                ->hideFromIndex()
                ->rules('nullable', 'integer')
                ->help('Price snapshot at registration (stored in cents).'),

            Currency::make('Due', 'amount_due_cents')
                ->asMinorUnits()
                ->sortable()
                ->rules('nullable', 'integer')
                ->help('Outstanding balance (stored in cents).'),

            Currency::make('Paid', 'amount_paid_cents')
                ->asMinorUnits()
                ->sortable()
                ->rules('nullable', 'integer')
                ->help('Amount received (stored in cents).'),

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

            Text::make('Zeffy Ticket', 'zeffy_ticket_id')
                ->onlyOnDetail(),

            Text::make('Zeffy Contact', 'zeffy_contact_id')
                ->onlyOnDetail(),

            Text::make('Zeffy Campaign', 'zeffy_campaign_id')
                ->onlyOnDetail(),

            Text::make('Zeffy Discount Code', 'zeffy_discount_code')
                ->onlyOnDetail()
                ->help('Discount code seen on the Zeffy payload — reference only, never proof of eligibility.'),

            DateTime::make('Paid At', 'paid_at')
                ->exceptOnForms()
                ->help('When cash was collected / the online payment was reconciled.'),

            Text::make('Paid By', 'paid_by')
                ->onlyOnDetail()
                ->help('Staff member who collected cash.'),

            DateTime::make('Checked In At', 'checked_in_at')
                ->exceptOnForms(),

            Text::make('Checked In By', 'checked_in_by')
                ->onlyOnDetail(),

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
            new Filters\CampRegistrationPaymentMethod,
            new Filters\CampRegistrationCheckinStatus,
            new Filters\CampRegistrationCashEligible,
        ];
    }

    /**
     * Get the lenses available for the resource.
     *
     * @return array<int, \Laravel\Nova\Lenses\Lens>
     */
    public function lenses(NovaRequest $request): array
    {
        return [
            new Lenses\CashReconciliation,
        ];
    }

    /**
     * Get the actions available for the resource.
     *
     * @return array<int, \Laravel\Nova\Actions\Action>
     */
    public function actions(NovaRequest $request): array
    {
        return [
            (new Actions\CashReceivedAndCheckIn)
                ->confirmText('Confirm that cash has been physically received, then check the attendee in.')
                ->confirmButtonText('Cash Received & Check In')
                ->cancelButtonText('Cancel'),
            (new Actions\CheckIn)
                ->confirmText('Check this attendee in.')
                ->confirmButtonText('Check In')
                ->cancelButtonText('Cancel'),
            (new Actions\ResolveReview),
            ExportAsCsv::make(),
        ];
    }
}
