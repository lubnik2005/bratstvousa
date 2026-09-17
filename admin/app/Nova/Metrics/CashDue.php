<?php

namespace App\Nova\Metrics;

use App\Models\CampRegistration;
use DateTimeInterface;
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Metrics\Value;
use Laravel\Nova\Metrics\ValueResult;

/**
 * Cash still outstanding = sum(amount_due_cents) on registrations that still
 * owe money via the cash workflow: status DUE (authorized cash not yet
 * collected) or REVIEW_REQUIRED (unauthorized $0 checkout). Spec §27.
 * D1-safe aggregate sum.
 */
class CashDue extends Value
{
    public $name = 'Cash Still Due';

    public function calculate(NovaRequest $request): ValueResult
    {
        $cents = (int) CampRegistration::query()
            ->whereIn('payment_status', ['DUE', 'REVIEW_REQUIRED'])
            ->sum('amount_due_cents');

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
        return 'cash-due';
    }
}
