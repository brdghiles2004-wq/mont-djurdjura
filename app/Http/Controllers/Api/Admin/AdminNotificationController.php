<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminNotificationController extends Controller
{
    /**
     * Count unread notifications by target.
     */
    private function getUnreadCounts(Request $request): array
    {
        $unreadNotifications = $request->user()
            ->unreadNotifications()
            ->get(['data']);

        $counts = [
            'messages' => 0,
            'devis' => 0,
        ];

        foreach ($unreadNotifications as $notification) {
            $data = $notification->data ?? [];

            if (is_string($data)) {
                $data = json_decode($data, true) ?: [];
            }

            $target = $data['target'] ?? null;

            if (isset($counts[$target])) {
                $counts[$target]++;
            }
        }

        return $counts;
    }

    /**
     * Get the latest notifications and unread counts.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $unreadByTarget = $this->getUnreadCounts($request);

        return response()->json([
            'notifications' => $user->notifications()
                ->latest()
                ->limit(20)
                ->get(),

            'unread_count' => array_sum($unreadByTarget),
            'unread_by_target' => $unreadByTarget,
        ]);
    }

    /**
     * Mark one notification as read.
     */
    public function markRead(
        Request $request,
        string $notification
    ): JsonResponse {
        $record = $request->user()
            ->notifications()
            ->whereKey($notification)
            ->firstOrFail();

        $record->markAsRead();

        $unreadByTarget = $this->getUnreadCounts($request);

        return response()->json([
            'success' => true,
            'unread_count' => array_sum($unreadByTarget),
            'unread_by_target' => $unreadByTarget,
        ]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllRead(Request $request): JsonResponse
    {
        $request->user()
            ->unreadNotifications()
            ->update(['read_at' => now()]);

        return response()->json([
            'success' => true,
            'unread_count' => 0,
            'unread_by_target' => [
                'messages' => 0,
                'devis' => 0,
            ],
        ]);
    }
}
