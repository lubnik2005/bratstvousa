<?php

namespace App\Nova\Fields;

use Illuminate\Support\Stringable;
use Laravel\Nova\Fields\Badge;

/**
 * Badge that never throws on unexpected values.
 *
 * Nova's Badge::resolveBadgeClasses() throws when the stored value is not in
 * the map (and also when the value is null). Our shared D1 tables are written
 * by the SvelteKit app and by migrations/backfills, so a value the admin
 * doesn't know about yet must degrade to a neutral badge instead of 500-ing
 * every index/detail page of the resource.
 */
class SafeBadge extends Badge
{
    /**
     * Type used for unknown / null values.
     */
    protected string $fallbackType = 'info';

    /**
     * Label used when the value is null / empty.
     */
    protected string $emptyLabel = '—';

    public function fallback(string $type): static
    {
        $this->fallbackType = $type;

        return $this;
    }

    public function emptyLabel(string $label): static
    {
        $this->emptyLabel = $label;

        return $this;
    }

    #[\Override]
    public function resolveBadgeClasses(): array|string
    {
        $value = $this->value;

        if ($value === null || $value === '') {
            return $this->types[$this->fallbackType] ?? '';
        }

        $mappedValue = $this->map[$value] ?? $value;

        if (! isset($this->types[$mappedValue])) {
            return $this->types[$this->fallbackType] ?? '';
        }

        return $this->types[$mappedValue];
    }

    #[\Override]
    public function resolveLabel(): Stringable|string
    {
        if ($this->value === null || $this->value === '') {
            return $this->emptyLabel;
        }

        return parent::resolveLabel();
    }

    #[\Override]
    public function resolveIcon(): string
    {
        $mappedValue = $this->map[$this->value ?? ''] ?? $this->value;

        return $this->icons[$mappedValue] ?? '';
    }
}
