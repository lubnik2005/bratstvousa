<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

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

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->append(\App\Http\Middleware\SecurityHeaders::class);

        $middleware->redirectGuestsTo(fn () => route('nova.login'));

        // Behind Cloudflare + local nginx reverse proxy. Trust all proxies so
        // Laravel reads the correct client IP and X-Forwarded-Proto (https),
        // which is required for correct URL/scheme generation and secure cookies.
        $middleware->trustProxies(
            at: '*',
            headers: Request::HEADER_X_FORWARDED_FOR
                | Request::HEADER_X_FORWARDED_HOST
                | Request::HEADER_X_FORWARDED_PORT
                | Request::HEADER_X_FORWARDED_PROTO
                | Request::HEADER_X_FORWARDED_AWS_ELB
        );
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
