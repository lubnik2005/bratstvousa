<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class GeneralSettings extends Settings
{
    public string $donation_url = '';

    public string $donation_tokenuid = '';

    public static function group(): string
    {
        return 'general';
    }
}
