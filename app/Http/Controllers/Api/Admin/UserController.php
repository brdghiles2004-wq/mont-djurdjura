<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'users' => User::with('roles.permissions')
                ->select('id', 'name', 'email', 'created_at')
                ->orderByDesc('id')
                ->get(),
            'roles' => Role::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role_ids' => ['required', 'array', 'min:1'],
            'role_ids.*' => ['integer', 'exists:roles,id'],
        ]);

        $this->authorizeSuperAdminAssignment($request, $data['role_ids']);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $user->roles()->sync($data['role_ids']);

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur créé avec succès.',
            'user' => $user->load('roles.permissions'),
        ], 201);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => ['nullable', 'string', 'min:8'],
            'role_ids' => ['required', 'array', 'min:1'],
            'role_ids.*' => ['integer', 'exists:roles,id'],
        ]);

        $this->authorizeSuperAdminAssignment($request, $data['role_ids']);

        $removesSuperAdmin = $user->hasRole('super_admin')
            && !in_array(
                Role::where('slug', 'super_admin')->value('id'),
                $data['role_ids']
            );

        if ($removesSuperAdmin) {
            $remaining = User::whereHas('roles', function ($query) {
                $query->where('slug', 'super_admin');
            })->where('id', '!=', $user->id)->exists();

            if (!$remaining) {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de retirer le dernier Super Admin.',
                ], 422);
            }
        }

        $user->name = $data['name'];
        $user->email = $data['email'];

        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();
        $user->roles()->sync($data['role_ids']);

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur modifié avec succès.',
            'user' => $user->load('roles.permissions'),
        ]);
    }

    public function destroy(Request $request, User $user)
    {
        if ($request->user()->id === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas supprimer votre propre compte.',
            ], 422);
        }

        if ($user->hasRole('super_admin')) {
            $remaining = User::whereHas('roles', function ($query) {
                $query->where('slug', 'super_admin');
            })->where('id', '!=', $user->id)->exists();

            if (!$remaining) {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de supprimer le dernier Super Admin.',
                ], 422);
            }
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur supprimé avec succès.',
        ]);
    }

    private function authorizeSuperAdminAssignment(
        Request $request,
        array $roleIds
    ): void {
        $superAdminId = Role::where('slug', 'super_admin')->value('id');

        if (
            $superAdminId &&
            in_array($superAdminId, $roleIds) &&
            !$request->user()->hasRole('super_admin')
        ) {
            abort(403, 'Seul le Super Admin peut attribuer ce rôle.');
        }
    }
}
