<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Get authenticated admin user.
     */
    public function user(Request $request)
    {
        $user = $request->user()->load('roles.permissions');

        return response()->json([
            'success' => true,
            'user' => $user,
        ]);
    }

    /**
     * Admin login.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (
            ! $user ||
            ! Hash::check($credentials['password'], $user->password)
        ) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.'],
            ]);
        }

        Auth::login($user);

        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie.',
            'user' => $user->load('roles.permissions'),
        ]);
    }

    /**
     * Update authenticated user's personal information.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
        ]);

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Profil mis à jour avec succès.',
            'user' => $user->fresh()->load('roles.permissions'),
        ]);
    }

    /**
     * Update authenticated user's password.
     */
    public function updatePassword(Request $request)
    {
        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();

        if (! Hash::check($data['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => [
                    'Le mot de passe actuel est incorrect.',
                ],
            ]);
        }

        // The "hashed" cast in User.php hashes the new password automatically.
        $user->password = $data['password'];
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe modifié avec succès.',
        ]);
    }

    /**
     * Admin logout.
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie.',
        ]);
    }
}
