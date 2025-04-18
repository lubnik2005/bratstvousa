<?php

namespace App\NovaSettings;

use App\Settings\DonationSettings;
use Ferdiunal\NovaSettings\SettingResource;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\URL;

class DonationSettingsResource extends SettingResource
{
    /**
     * The settings class that this resource corresponds to.
     *
     * @return class-string<\App\Settings\GeneralSettings>
     */
    public static function settings(): string
    {
        return DonationSettings::class;
    }

    /**
     * The title for the setting resource.
     */
    public static function title(): string
    {
        return 'Donation Settings';
    }

    /**
     * The description for the setting resource.
     */
    public static function description(): string
    {
        return '';
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
