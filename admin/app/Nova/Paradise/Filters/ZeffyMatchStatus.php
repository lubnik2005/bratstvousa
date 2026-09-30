<?php

namespace App\Nova\Paradise\Filters;

use App\Nova\Paradise\ZeffyPayment;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Laravel\Nova\Filters\Filter;
use Laravel\Nova\Http\Requests\NovaRequest;

class ZeffyMatchStatus extends Filter
{
    public $component = 'select-filter';

    public function name(): string
    {
        return 'Match status';
    }

    public function apply(NovaRequest $request, Builder $query, mixed $value): Builder
    {
        return $query->where('match_status', $value);
    }

    public function options(NovaRequest $request): array
    {
        return array_flip(ZeffyPayment::$matchStatuses);
    }
}
