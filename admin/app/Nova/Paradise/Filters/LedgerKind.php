<?php

namespace App\Nova\Paradise\Filters;

use App\Nova\Paradise\LedgerEntry;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Laravel\Nova\Filters\Filter;
use Laravel\Nova\Http\Requests\NovaRequest;

class LedgerKind extends Filter
{
    public $component = 'select-filter';

    public function name(): string
    {
        return 'Kind';
    }

    public function apply(NovaRequest $request, Builder $query, mixed $value): Builder
    {
        return $query->where('kind', $value);
    }

    /**
     * @return array<string, string>
     */
    public function options(NovaRequest $request): array
    {
        return array_flip(LedgerEntry::$kinds);
    }
}
