<?php

namespace App\NovaSettings;

use Spatie\LaravelSettings\Settings;

class DonationSettings extends Settings
{
    public string $donation_url = '';

    public string $donation_tokenuid = '';

    public static function group(): string
    {
        return 'general';
    }
}
