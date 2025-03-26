<?php

namespace App\NovaSettings;

use App\Settings\PageContentSettings;
use Ferdiunal\NovaSettings\SettingResource;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Trix;

class PageContentResource extends SettingResource
{
    /**
     * The settings class that this resource corresponds to.
     * @return class-string<\App\Settings\PageContentSettings>
     */
    public static function settings(): string
    {
        return PageContentSettings::class;
    }

    /**
     * The title for the setting resource.
     *
     * @return string
     */
    public static function title(): string
    {
        return 'Page Content';
    }

    /**
     * The description for the setting resource.
     *
     * @return string
     */
    public static function description(): string
    {
        return '';
    }

    /**
     * The order of the setting resource.
     *
     * @return int
     */
    public static function order(): int
    {
        return 1;
    }

    /**
     * Get the fields displayed by the resource.
     *
     * @return array
     */
    public static function fields(): array
    {
        return [
            Trix::make('Short Introduction Content', 'short_introduction_content'),
        ];
    }
}
