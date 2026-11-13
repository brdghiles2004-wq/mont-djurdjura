<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $modules = [
            'products' => ['view', 'create', 'update', 'delete'],
            'categories' => ['view', 'create', 'update', 'delete'],
            'clients' => ['view', 'create', 'update', 'delete'],
            'devis' => ['view', 'update', 'reply'],
            'messages' => ['view', 'update', 'reply'],
            'emails' => ['view', 'resend'],
            'gallery' => ['view', 'create', 'update', 'delete'],
            'pages' => ['view', 'create', 'update', 'delete'],
            'seo' => ['view', 'update'],
            'settings' => ['view', 'update'],
            'users' => ['view', 'create', 'update', 'delete'],
            'roles' => ['view', 'create', 'update', 'delete'],
        ];

        $permissions = [];

        foreach ($modules as $module => $actions) {
            foreach ($actions as $action) {
                $slug = "{$module}.{$action}";

                $permission = Permission::updateOrCreate(
                    ['slug' => $slug],
                    [
                        'name' => ucfirst($action) . ' ' . ucfirst($module),
                        'module' => $module,
                        'action' => $action,
                    ]
                );

                $permissions[$slug] = $permission->id;
            }
        }

        // Super Admin
        $superAdmin = Role::updateOrCreate(
            ['slug' => 'super_admin'],
            [
                'name' => 'Super Admin',
                'description' => 'Accès complet à toutes les fonctionnalités.',
                'is_system' => true,
            ]
        );

        // Admin
        $admin = Role::updateOrCreate(
            ['slug' => 'admin'],
            [
                'name' => 'Admin',
                'description' => 'Gestion du site et de son contenu.',
                'is_system' => true,
            ]
        );

        // Commercial
        $commercial = Role::updateOrCreate(
            ['slug' => 'commercial'],
            [
                'name' => 'Commercial',
                'description' => 'Gestion commerciale et suivi des demandes.',
                'is_system' => true,
            ]
        );

        // Super Admin : toutes les permissions
        $superAdmin->permissions()->sync(
            array_values($permissions)
        );

        // Admin : toutes les permissions sauf utilisateurs et rôles
        $adminPermissions = collect($permissions)
            ->filter(function ($id, $slug) {
                return !str_starts_with($slug, 'users.')
                    && !str_starts_with($slug, 'roles.');
            })
            ->values()
            ->all();

        $admin->permissions()->sync($adminPermissions);

        // Commercial : permissions commerciales uniquement
        $commercialSlugs = [
            'clients.view',
            'clients.create',
            'clients.update',
            'devis.view',
            'devis.update',
            'devis.reply',
            'messages.view',
            'messages.update',
            'messages.reply',
            'emails.view',
        ];

        $commercialPermissions = collect($commercialSlugs)
            ->map(function ($slug) use ($permissions) {
                return $permissions[$slug];
            })
            ->all();

        $commercial->permissions()->sync($commercialPermissions);
    }
}
