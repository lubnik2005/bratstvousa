<?php

namespace App\NovaSettings;

use App\Settings\GeneralSettings;
use Ferdiunal\NovaSettings\SettingResource;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\URL;

class GeneralSettingsResource extends SettingResource
{
    /**
     * The settings class that this resource corresponds to.
     *
     * @return class-string<\App\Settings\GeneralSettings>
     */
    public static function settings(): string
    {
        return GeneralSettings::class;
    }

    /**
     * The title for the setting resource.
     */
    public static function title(): string
    {
        return 'General Settings';
    }

    /**
     * The description for the setting resource.
     */
    public static function description(): string
    {
        return 'Let all your things have their places; let each part of your business have its time. - Benjamin Franklin';
    }

    /**
     * The order of the setting resource.
     */
    public static function order(): int
    {
        return 0;
    }

    /**
     * Get the fields displayed by the resource.
     *
     * @return array<int, \Laravel\Nova\Fields\Field|\Laravel\Nova\Panel>
     */
    public static function fields(): array
    {
        return [
            URL::make('Donation URL', 'donation_url')
                ->help('The link to the form action.'),
            Text::make('Donation token UID', 'donation_tokenuid')
                ->rules('required'),

        ];
    }
}
