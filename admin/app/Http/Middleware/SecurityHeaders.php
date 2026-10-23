<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        // The check-in scanner needs same-origin camera access.
        $response->headers->set('Permissions-Policy', 'camera=(self), microphone=(), geolocation=()');
        // Restrict framing/base URLs without breaking Nova's inline scripts or external editors.
        $response->headers->set('Content-Security-Policy', "frame-ancestors 'self'; base-uri 'self'");

        if ($request->isSecure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000');
        }

        return $response;
    }
}
