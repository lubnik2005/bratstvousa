<?php

namespace App\Nova\Filters;

use App\Nova\EmailLog;
use Laravel\Nova\Filters\Filter;
use Laravel\Nova\Http\Requests\NovaRequest;

class EmailLogStatus extends Filter
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
        return 'Status';
    }

    /**
     * Apply the filter to the given query.
     *
     * @param  \Illuminate\Contracts\Database\Eloquent\Builder  $query
     * @return \Illuminate\Contracts\Database\Eloquent\Builder
     */
    public function apply(NovaRequest $request, $query, mixed $value)
    {
        return $query->where('status', $value);
    }

    /**
     * Get the filter's available options.
     *
     * @return array<string, string>
     */
    public function options(NovaRequest $request): array
    {
        return array_flip(EmailLog::$statuses);
    }
}
