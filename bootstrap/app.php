<?php

use App\Http\Middleware\EnsureUserHasPermission;
use App\Http\Middleware\UseCrossSiteSessionCookies;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {

        // Trust reverse proxy headers from Render.
        $middleware->trustProxies(
            at: '*',
            headers: Request::HEADER_X_FORWARDED_FOR |
                Request::HEADER_X_FORWARDED_HOST |
                Request::HEADER_X_FORWARDED_PORT |
                Request::HEADER_X_FORWARDED_PROTO |
                Request::HEADER_X_FORWARDED_AWS_ELB
        );

        // Sanctum SPA authentication.
        $middleware->statefulApi();

        // Cross-site session cookie settings.
        $middleware->api(append: [
            UseCrossSiteSessionCookies::class,
        ]);

        // Public forms do not require CSRF session authentication.
        // Admin authentication remains protected.
        $middleware->validateCsrfTokens(except: [
            'api/contact',
            'api/devis',
        ]);

        // Custom middleware aliases.
        $middleware->alias([
            'permission' => EnsureUserHasPermission::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })
    ->create();
