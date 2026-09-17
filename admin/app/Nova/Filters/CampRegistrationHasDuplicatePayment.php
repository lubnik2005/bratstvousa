<?php

namespace App\Nova\Filters;

use App\Models\ZeffyPayment;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Laravel\Nova\Filters\Filter;
use Laravel\Nova\Http\Requests\NovaRequest;

/**
 * Registrations that have at least one extra Zeffy payment/ticket flagged as
 * "duplicate" (the same CAMP- code was used for a second checkout).
 */
class CampRegistrationHasDuplicatePayment extends Filter
{
    /**
     * The filter's component.
     *
     * @var string
     */
    public $component = 'select-filter';

    /**
     * The displayable name of the filter.
     */
    public function name(): string
    {
        return 'Duplicate payment';
    }

    /**
     * Apply the filter to the given query.
     */
    public function apply(NovaRequest $request, Builder $query, mixed $value): Builder
    {
        $duplicateRegIds = ZeffyPayment::query()
            ->where('match_status', 'duplicate')
            ->whereNotNull('matched_registration_id')
            ->select('matched_registration_id');

        return (string) $value === '1'
            ? $query->whereIn('id', $duplicateRegIds)
            : $query->whereNotIn('id', $duplicateRegIds);
    }

    /**
     * Get the filter's available options.
     *
     * @return array<string, string>
     */
    public function options(NovaRequest $request): array
    {
        return [
            'Has duplicate' => '1',
            'No duplicate' => '0',
        ];
    }
}
