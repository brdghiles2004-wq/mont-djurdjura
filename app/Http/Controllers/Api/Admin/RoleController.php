<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class RoleController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'roles' => Role::with('permissions')->withCount('users')->orderBy('id')->get(),
            'permissions' => Permission::orderBy('module')->orderBy('action')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'permission_ids' => ['sometimes', 'array'],
            'permission_ids.*' => ['integer', 'exists:permissions,id'],
        ]);

        $slug = Str::slug($data['name'], '_');

        if (in_array($slug, ['super_admin', 'admin', 'commercial'])) {
            return response()->json([
                'success' => false,
                'message' => 'Ce nom de rôle est réservé.',
            ], 422);
        }

        $role = Role::create([
            'name' => $data['name'],
            'slug' => $slug . '_' . Str::lower(Str::random(5)),
            'description' => $data['description'] ?? null,
            'is_system' => false,
        ]);

        $role->permissions()->sync($data['permission_ids'] ?? []);

        return response()->json([
            'success' => true,
            'message' => 'Rôle créé avec succès.',
            'role' => $role->load('permissions'),
        ], 201);
    }

    public function update(Request $request, Role $role)
    {
        if ($role->is_system) {
            return response()->json([
                'success' => false,
                'message' => 'Les rôles système ne peuvent pas être renommés.',
            ], 403);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'permission_ids' => ['sometimes', 'array'],
            'permission_ids.*' => ['integer', 'exists:permissions,id'],
        ]);

        $role->update([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
        ]);

        if (array_key_exists('permission_ids', $data)) {
            $role->permissions()->sync($data['permission_ids']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Rôle modifié avec succès.',
            'role' => $role->load('permissions'),
        ]);
    }

    public function destroy(Role $role)
    {
        if ($role->is_system) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer un rôle système.',
            ], 403);
        }

        if ($role->users()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Ce rôle est encore attribué à des utilisateurs.',
            ], 422);
        }

        $role->delete();

        return response()->json([
            'success' => true,
            'message' => 'Rôle supprimé avec succès.',
        ]);
    }
}
