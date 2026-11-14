<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

class UseCrossSiteSessionCookies
{
    public function handle(Request $request, Closure $next): Response
    {
        if (
            app()->environment('production') &&
            EnsureFrontendRequestsAreStateful::fromFrontend($request)
        ) {
            config([
                'session.same_site' => 'none',
                'session.secure' => true,
                'session.http_only' => true,
            ]);
        }

        return $next($request);
    }
}
