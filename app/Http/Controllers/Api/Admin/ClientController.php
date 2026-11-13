<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ClientController extends Controller
{
    /**
     * List clients with search and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Client::query()
            ->withCount([
                'contactMessages',
                'devisRequests',
            ])
            ->latest();

        if ($request->filled('search')) {
            $search = trim($request->input('search'));

            $query->where(function ($builder) use ($search) {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('wilaya', 'like', "%{$search}%");
            });
        }

        $clients = $query->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $clients,
        ]);
    }

    /**
     * Create a client manually.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'company' => ['nullable', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:255', 'unique:clients,email'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'wilaya' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string', 'max:10000'],
        ]);

        $validated['email'] = strtolower(trim($validated['email']));

        $client = Client::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Client créé avec succès.',
            'data' => $client,
        ], 201);
    }

    /**
     * Show client details and history.
     */
    public function show(Client $client): JsonResponse
    {
        $client->loadCount([
            'contactMessages',
            'devisRequests',
        ]);

        $client->load([
            'contactMessages' => function ($query) {
                $query->latest()->limit(20);
            },
            'devisRequests' => function ($query) {
                $query->latest()->limit(20);
            },
        ]);

        return response()->json([
            'success' => true,
            'data' => $client,
        ]);
    }

    /**
     * Update client information.
     */
    public function update(Request $request, Client $client): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'company' => ['nullable', 'string', 'max:150'],
            'email' => [
                'sometimes',
                'required',
                'email',
                'max:255',
                Rule::unique('clients', 'email')->ignore($client->id),
            ],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'wilaya' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string', 'max:10000'],
        ]);

        if (isset($validated['email'])) {
            $validated['email'] = strtolower(trim($validated['email']));
        }

        $client->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Client modifié avec succès.',
            'data' => $client->fresh(),
        ]);
    }

    /**
     * Delete a client.
     * Related messages and devis requests are preserved.
     */
    public function destroy(Client $client): JsonResponse
    {
        $client->delete();

        return response()->json([
            'success' => true,
            'message' => 'Client supprimé avec succès.',
        ]);
    }
}