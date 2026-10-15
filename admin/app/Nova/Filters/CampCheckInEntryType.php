<?php

namespace App\Nova\Filters;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Laravel\Nova\Filters\Filter;
use Laravel\Nova\Http\Requests\NovaRequest;

class CampCheckInEntryType extends Filter
{
    public $component = 'select-filter';

    public function name(): string
    {
        return 'Entry type';
    }

    public function apply(NovaRequest $request, Builder $query, mixed $value): Builder
    {
        return $query->where('is_repeat', $value === 'repeat');
    }

    public function options(NovaRequest $request): array
    {
        return [
            'First entry' => 'first',
            'Repeat entry' => 'repeat',
        ];
    }
}
