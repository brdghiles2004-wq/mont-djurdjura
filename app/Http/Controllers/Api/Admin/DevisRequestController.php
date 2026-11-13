<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\DevisRequest;
use App\Models\EmailLog;
use App\Services\EmailLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Throwable;

class DevisRequestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $statuses = [
            'new',
            'in_progress',
            'replied',
            'rejected',
            'archived',
        ];

        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:150'],
            'status' => ['nullable', Rule::in($statuses)],
            'date_from' => ['nullable', 'date'],
            'date_to' => [
                'nullable',
                'date',
                'after_or_equal:date_from',
            ],

            'export_search' => ['nullable', 'string', 'max:150'],
            'export_status' => ['nullable', Rule::in($statuses)],
            'export_date_from' => ['nullable', 'date'],
            'export_date_to' => [
                'nullable',
                'date',
                'after_or_equal:export_date_from',
            ],
        ]);

        $query = DevisRequest::query()->orderByDesc('created_at');

        $this->applyFilters($query, $validated, '');
        $this->applyFilters($query, $validated, 'export_');

        return response()->json(
            $query->paginate(15)->withQueryString()
        );
    }

    private function applyFilters($query, array $filters, string $prefix): void
    {
        $searchKey = $prefix . 'search';
        $statusKey = $prefix . 'status';
        $dateFromKey = $prefix . 'date_from';
        $dateToKey = $prefix . 'date_to';

        if (!empty($filters[$searchKey])) {
            $search = $filters[$searchKey];

            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('product', 'like', "%{$search}%");
            });
        }

        if (!empty($filters[$statusKey])) {
            $query->where('status', $filters[$statusKey]);
        }

        if (!empty($filters[$dateFromKey])) {
            $query->whereDate(
                'created_at',
                '>=',
                $filters[$dateFromKey]
            );
        }

        if (!empty($filters[$dateToKey])) {
            $query->whereDate(
                'created_at',
                '<=',
                $filters[$dateToKey]
            );
        }
    }

    public function show(DevisRequest $devis): JsonResponse
    {
        $emailHistory = EmailLog::query()
            ->where('related_type', DevisRequest::class)
            ->where('related_id', $devis->id)
            ->where('type', 'devis_reply')
            ->orderByDesc('created_at')
            ->get([
                'id',
                'recipient',
                'subject',
                'body_text',
                'status',
                'error_message',
                'sent_at',
                'created_at',
                'created_by',
            ]);

        return response()->json([
            'devis' => $devis,
            'email_history' => $emailHistory,
        ]);
    }

    public function update(
        Request $request,
        DevisRequest $devis
    ): JsonResponse {
        $validated = $request->validate([
            'status' => [
                'sometimes',
                'required',
                Rule::in([
                    'new',
                    'in_progress',
                    'rejected',
                    'archived',
                ]),
            ],
            'internal_notes' => [
                'sometimes',
                'nullable',
                'string',
                'max:10000',
            ],
        ]);

        if (
            isset($validated['status']) &&
            $validated['status'] !== 'replied'
        ) {
            $devis->replied_at = null;
        }

        $devis->update($validated);

        return response()->json([
            'message' => 'La demande a été mise à jour avec succès.',
            'devis' => $devis->fresh(),
        ]);
    }

    public function reply(
        Request $request,
        DevisRequest $devis,
        EmailLogService $emailLogService
    ): JsonResponse {
        $validated = $request->validate([
            'reply' => [
                'required',
                'string',
                'min:2',
                'max:10000',
            ],
        ]);

        $reply = trim($validated['reply']);

        if ($reply === '') {
            return response()->json([
                'success' => false,
                'message' => 'La réponse ne peut pas être vide.',
            ], 422);
        }

        $subject = 'Re: Demande de devis #' .
            str_pad((string) $devis->id, 5, '0', STR_PAD_LEFT);

        if (!empty($devis->product)) {
            $subject .= ' - ' . $devis->product;
        }

        $body = $reply . "\n\n"
            . "Cordialement,\n"
            . "L'équipe Mont Djurdjura";

        try {
            $emailLogService->sendRaw([
                'recipient' => $devis->email,
                'subject' => $subject,
                'body' => $body,
                'type' => 'devis_reply',
                'related_type' => DevisRequest::class,
                'related_id' => $devis->id,
                'created_by' => auth()->id(),
            ]);

            // Le statut change uniquement après l'envoi réussi.
            $devis->status = 'replied';
            $devis->replied_at = now();
            $devis->save();

            return response()->json([
                'success' => true,
                'message' => 'La réponse a été envoyée avec succès.',
                'devis' => $devis->fresh(),
            ]);
        } catch (Throwable $exception) {
            Log::error('Devis reply failed.', [
                'devis_id' => $devis->id,
                'recipient' => $devis->email,
                'error' => $exception->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => "L'envoi de l'email a échoué. Consultez l'historique des emails pour plus de détails.",
            ], 500);
        }
    }
}
