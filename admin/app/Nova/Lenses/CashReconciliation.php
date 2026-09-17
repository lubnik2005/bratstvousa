<?php

namespace App\Nova\Lenses;

use App\Nova\Fields\SafeBadge;
use App\Nova\Filters\CampRegistrationCashEligible;
use App\Nova\Filters\CampRegistrationCheckinStatus;
use App\Nova\Filters\CampRegistrationPaymentMethod;
use App\Nova\Filters\CampRegistrationPaymentStatus;
use App\Nova\Metrics\CashCollected;
use App\Nova\Metrics\CashDue;
use App\Nova\Metrics\CashExpected;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Contracts\Pagination\Paginator;
use Laravel\Nova\Fields\Currency;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\LensRequest;
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Lenses\Lens;
use Laravel\Nova\Nova;

/**
 * Cash-at-check-in reconciliation report (spec §27).
 *
 * Scoped to registrations that participate in the cash workflow — anything that
 * is not a straightforward online payment: cash method, or a status that still
 * needs staff attention (DUE / REVIEW_REQUIRED). Online/paid rows are excluded
 * so the numbers reflect cash owed vs. collected. Use the built-in filters
 * (event, church, method, status, check-in, cash eligible) to narrow further,
 * and ExportAsCsv for offline reconciliation.
 */
class CashReconciliation extends Lens
{
    /**
     * @var array
     */
    public static $search = [
        'id', 'first_name', 'last_name', 'email', 'confirmation_code', 'church',
    ];

    /**
     * Get the query builder / paginator for the lens.
     */
    public static function query(LensRequest $request, Builder $query): Builder|Paginator
    {
        // Cash workflow rows only: exclude clean online payments and empty
        // pending rows that never reached Zeffy.
        $query->where(function (Builder $q) {
            $q->where('payment_method', 'CASH')
                ->orWhereIn('payment_status', ['DUE', 'REVIEW_REQUIRED']);
        });

        return $request->withOrdering($request->withFilters($query));
    }

    /**
     * Get the fields available to the lens.
     *
     * @return array<int, \Laravel\Nova\Fields\Field>
     */
    public function fields(NovaRequest $request): array
    {
        return [
            ID::make(Nova::__('ID'), 'id')->sortable(),

            Text::make('Name', function ($r) {
                return trim($r->first_name.' '.$r->last_name);
            }),

            Text::make('Church', 'church')->hideFromIndex(false),

            Text::make('Event', 'event_slug'),

            SafeBadge::make('Payment', 'payment_status')->map([
                'PENDING' => 'warning',
                'DUE' => 'warning',
                'PAID' => 'success',
                'REVIEW_REQUIRED' => 'danger',
                'REFUNDED' => 'info',
                'CANCELED' => 'info',
                'unpaid' => 'warning',
                'paid' => 'success',
            ]),

            Text::make('Method', 'payment_method'),

            Currency::make('Due', 'amount_due_cents')->asMinorUnits()->sortable(),

            Currency::make('Paid', 'amount_paid_cents')->asMinorUnits()->sortable(),

            SafeBadge::make('Check-in', 'checkin_status')->map([
                'NOT_CHECKED_IN' => 'warning',
                'CHECKED_IN' => 'success',
            ]),

            Text::make('Cash By', 'paid_by')->hideFromIndex(),

            Text::make('Checked In By', 'checked_in_by')->hideFromIndex(),
        ];
    }

    /**
     * Get the cards available on the lens.
     *
     * @return array<int, \Laravel\Nova\Card>
     */
    public function cards(NovaRequest $request): array
    {
        return [
            new CashExpected,
            new CashCollected,
            new CashDue,
        ];
    }

    /**
     * Get the filters available for the lens.
     *
     * @return array<int, \Laravel\Nova\Filters\Filter>
     */
    public function filters(NovaRequest $request): array
    {
        return [
            new CampRegistrationPaymentStatus,
            new CampRegistrationPaymentMethod,
            new CampRegistrationCheckinStatus,
            new CampRegistrationCashEligible,
        ];
    }

    /**
     * Get the actions available on the lens.
     *
     * @return array<int, \Laravel\Nova\Actions\Action>
     */
    public function actions(NovaRequest $request): array
    {
        return parent::actions($request);
    }

    /**
     * Get the URI key for the lens.
     */
    public function uriKey(): string
    {
        return 'cash-reconciliation';
    }
}
