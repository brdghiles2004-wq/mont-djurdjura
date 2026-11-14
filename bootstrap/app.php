
<?php

use App\Http\Middleware\EnsureUserHasPermission;
use App\Http\Middleware\UseCrossSiteSessionCookies;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\HandleCors;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {

        // Trust the reverse proxy headers from Render.
        $middleware->trustProxies(
            at: '*',
            headers: Request::HEADER_X_FORWARDED_FOR |
                Request::HEADER_X_FORWARDED_HOST |
                Request::HEADER_X_FORWARDED_PORT |
                Request::HEADER_X_FORWARDED_PROTO |
                Request::HEADER_X_FORWARDED_AWS_ELB
        );

        // CORS
        $middleware->prepend(HandleCors::class);

        // Sanctum SPA authentication
        $middleware->statefulApi();

        // Apply cross-site session cookie settings for trusted frontend requests.
        $middleware->api(append: [
            UseCrossSiteSessionCookies::class,
        ]);

        // CSRF exceptions
        $middleware->validateCsrfTokens(except: [
            'api/devis',
        ]);

        // Custom middleware aliases
        $middleware->alias([
            'permission' => EnsureUserHasPermission::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
