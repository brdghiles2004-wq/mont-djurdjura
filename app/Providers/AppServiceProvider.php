<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        if (app()->environment('production')) {
            config([
                'session.same_site' => 'none',
                'session.secure' => true,
            ]);
        }

        // Temporary diagnostic: capture session config immediately after this provider boots.
        config([
            'app.debug_session_same_site_after_provider' => config('session.same_site'),
        ]);
    }
}