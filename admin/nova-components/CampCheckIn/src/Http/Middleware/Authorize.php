<?php

namespace Bratstvo\CampCheckIn\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Authorize
{
    public function handle(Request $request, Closure $next): Response
    {
        abort_unless(
            $request->user()?->hasPermissionTo('view camp_registrations')
                && $request->user()?->hasPermissionTo('edit camp_registrations'),
            403
        );

        return $next($request);
    }
}
