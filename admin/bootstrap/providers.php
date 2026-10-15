<?php

spl_autoload_register(static function (string $class): void {
    $prefix = 'Bratstvo\\CampCheckIn\\';

    if (! str_starts_with($class, $prefix)) {
        return;
    }

    $path = __DIR__.'/../nova-components/CampCheckIn/src/'.str_replace('\\', '/', substr($class, strlen($prefix))).'.php';

    if (is_file($path)) {
        require $path;
    }
});

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\NovaServiceProvider::class,
    Bratstvo\CampCheckIn\ToolServiceProvider::class,
    Ebess\AdvancedNovaMediaLibrary\AdvancedNovaMediaLibraryServiceProvider::class,
];
