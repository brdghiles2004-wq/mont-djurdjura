<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\AdminSubmissionNotification;

class AdminNotificationService
{
    public function send(
        string $permission,
        string $type,
        string $title,
        string $message,
        string $target,
        int $reference
    ): void {
        $notification = new AdminSubmissionNotification(
            $type,
            $title,
            $message,
            $target,
            $reference
        );

        $users = User::query()
            ->where(function ($query) use ($permission) {
                $query->whereHas('roles', function ($roles) {
                    $roles->where('slug', 'super_admin');
                })->orWhereHas(
                    'roles.permissions',
                    function ($permissions) use ($permission) {
                        $permissions->where('slug', $permission);
                    }
                );
            })
            ->get();

        foreach ($users as $user) {
            $user->notify($notification);
        }
    }
}
