<?php

namespace App\Nova\Metrics;

use App\Models\CampRegistration;
use DateTimeInterface;
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Metrics\Value;
use Laravel\Nova\Metrics\ValueResult;

/**
 * Total cash expected = everything owed on cash-workflow registrations,
 * whether already collected or still outstanding (spec §27).
 *
 * expected = sum(amount_paid_cents) + sum(amount_due_cents) over rows that are
 * part of the cash workflow (method CASH or status DUE/REVIEW_REQUIRED).
 *
 * Computed with plain aggregate query-builder sums so it works on the
 * Cloudflare D1 driver (Nova's date-ranged Value helpers are avoided).
 */
class CashExpected extends Value
{
    public $name = 'Cash Expected';

    public function calculate(NovaRequest $request): ValueResult
    {
        $q = CampRegistration::query()->where(function ($q) {
            $q->where('payment_method', 'CASH')
                ->orWhereIn('payment_status', ['DUE', 'REVIEW_REQUIRED']);
        });

        $cents = (int) $q->sum('amount_paid_cents') + (int) $q->sum('amount_due_cents');

        return $this->result(round($cents / 100, 2))->currency();
    }

    /**
     * @return array<int|string, string>
     */
    public function ranges(): array
    {
        return [];
    }

    public function cacheFor(): ?DateTimeInterface
    {
        return null;
    }

    public function uriKey(): string
    {
        return 'cash-expected';
    }
}
