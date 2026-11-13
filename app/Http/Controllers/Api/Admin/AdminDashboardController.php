<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\ContactMessage;
use App\Models\DevisRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $latestDevis = DevisRequest::query()
            ->latest()
            ->limit(5)
            ->get([
                'id',
                'name',
                'company',
                'product',
                'status',
                'created_at',
            ]);

        $latestMessages = ContactMessage::query()
            ->latest()
            ->limit(5)
            ->get([
                'id',
                'name',
                'company',
                'subject',
                'status',
                'read_at',
                'created_at',
            ]);

        return response()->json([
            'stats' => [
                'products' => Product::count(),

                'active_products' => Product::where(
                    'is_active',
                    true
                )->count(),

                'devis' => DevisRequest::count(),

                'messages' => ContactMessage::count(),

                'unread_messages' => ContactMessage::whereNull(
                    'read_at'
                )->count(),

                'clients' => Client::count(),

                'unread_notifications' => $user
                    ->unreadNotifications()
                    ->count(),
            ],

            'latest' => [
                'devis' => $latestDevis,
                'messages' => $latestMessages,
            ],
        ]);
    }
}
