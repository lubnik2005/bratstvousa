<?php

namespace App\Nova\Metrics;

use App\Models\CampRegistration;
use DateTimeInterface;
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Metrics\Value;
use Laravel\Nova\Metrics\ValueResult;

/**
 * Cash actually collected = sum(amount_paid_cents) on registrations whose
 * payment_method is CASH (spec §27). D1-safe aggregate sum.
 */
class CashCollected extends Value
{
    public $name = 'Cash Collected';

    public function calculate(NovaRequest $request): ValueResult
    {
        $cents = (int) CampRegistration::query()
            ->where('payment_method', 'CASH')
            ->sum('amount_paid_cents');

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
        return 'cash-collected';
    }
}
