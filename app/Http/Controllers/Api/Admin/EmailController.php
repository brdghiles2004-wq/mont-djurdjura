<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailLog;
use App\Services\EmailLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Throwable;

class EmailController extends Controller
{
    /**
     * List outgoing emails with statistics and filters.
     */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::in(['pending', 'sent', 'failed'])],
            'type' => ['nullable', 'string', 'max:60'],
            'date_from' => ['nullable', 'date_format:Y-m-d'],
            'date_to' => [
                'nullable',
                'date_format:Y-m-d',
                'after_or_equal:date_from',
            ],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = EmailLog::query();

        if (!empty($validated['search'])) {
            $search = $validated['search'];

            $query->where(function ($q) use ($search) {
                $q->where('recipient', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        if (!empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        if (!empty($validated['type'])) {
            $query->where('type', $validated['type']);
        }

        if (!empty($validated['date_from'])) {
            $query->whereDate('created_at', '>=', $validated['date_from']);
        }

        if (!empty($validated['date_to'])) {
            $query->whereDate('created_at', '<=', $validated['date_to']);
        }

        $emails = $query
            ->latest()
            ->paginate($validated['per_page'] ?? 15)
            ->withQueryString();

        return response()->json([
            'statistics' => [
                'total' => EmailLog::count(),
                'sent' => EmailLog::where('status', 'sent')->count(),
                'failed' => EmailLog::where('status', 'failed')->count(),
                'today' => EmailLog::whereDate('created_at', today())->count(),
            ],

            'types' => EmailLog::query()
                ->select('type')
                ->distinct()
                ->orderBy('type')
                ->pluck('type'),

            'emails' => $emails,
        ]);
    }

    /**
     * Show one email.
     */
    public function show(EmailLog $email): JsonResponse
    {
        return response()->json([
            'email' => $email,
        ]);
    }

    /**
     * Resend a failed email.
     */
    public function resend(
        EmailLog $email,
        EmailLogService $emailLogService
    ): JsonResponse {
        if ($email->status !== 'failed') {
            return response()->json([
                'success' => false,
                'message' => 'Seuls les emails échoués peuvent être renvoyés.',
            ], 422);
        }

        try {
            $emailLogService->resend($email);

            return response()->json([
                'success' => true,
                'message' => 'Email envoyé avec succès.',
                'email' => $email->fresh(),
            ]);
        } catch (Throwable $exception) {
            Log::error('Email resend failed.', [
                'email_log_id' => $email->id,
                'recipient' => $email->recipient,
                'error' => $exception->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => "La nouvelle tentative d'envoi a échoué.",
                'email' => $email->fresh(),
            ], 500);
        }
    }
}
