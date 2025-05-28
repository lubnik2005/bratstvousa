<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class PageContentSettings extends Settings
{

    public string $short_introduction_content = '';

    public static function group(): string
    {
        return 'general';
    }
}
