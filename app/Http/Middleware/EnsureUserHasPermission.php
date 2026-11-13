<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasPermission
{
    public function handle(
        Request $request,
        Closure $next,
        string $permission
    ): Response {
        $user = $request->user();

        if (!$user || !$user->hasPermissionTo($permission)) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n’avez pas la permission nécessaire.',
            ], 403);
        }

        return $next($request);
    }
}
