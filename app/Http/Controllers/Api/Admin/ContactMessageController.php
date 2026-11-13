<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Services\EmailLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use Throwable;

class ContactMessageController extends Controller
{
    /**
     * List contact messages.
     */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => [
                'nullable',
                Rule::in(['new', 'read', 'replied', 'archived']),
            ],
            'date_from' => ['nullable', 'date_format:Y-m-d'],
            'date_to' => [
                'nullable',
                'date_format:Y-m-d',
                'after_or_equal:date_from',
            ],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = ContactMessage::query();

        if (!empty($validated['search'])) {
            $search = $validated['search'];

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%");
            });
        }

        if (!empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        if (!empty($validated['date_from'])) {
            $query->whereDate('created_at', '>=', $validated['date_from']);
        }

        if (!empty($validated['date_to'])) {
            $query->whereDate('created_at', '<=', $validated['date_to']);
        }

        $messages = $query
            ->latest()
            ->paginate($validated['per_page'] ?? 15)
            ->withQueryString();

        return response()->json([
            'messages' => $messages,
        ]);
    }

    /**
     * Show one contact message.
     */
    public function show(ContactMessage $contactMessage): JsonResponse
    {
        return response()->json([
            'contact_message' => $contactMessage,
        ]);
    }

    /**
     * Update status and internal notes.
     */
    public function update(
        Request $request,
        ContactMessage $contactMessage
    ): JsonResponse {
        $validated = $request->validate([
            'status' => [
                'sometimes',
                'required',
                Rule::in(['new', 'read', 'replied', 'archived']),
            ],
            'internal_notes' => [
                'sometimes',
                'nullable',
                'string',
                'max:5000',
            ],
        ]);

        $contactMessage->fill($validated);

        if (isset($validated['status'])) {
            if ($validated['status'] === 'replied') {
                if ($contactMessage->getOriginal('status') !== 'replied') {
                    $contactMessage->replied_at = now();
                }
            } else {
                $contactMessage->replied_at = null;
            }
        }

        $contactMessage->save();

        return response()->json([
            'success' => true,
            'message' => 'Message mis à jour avec succès.',
            'contact_message' => $contactMessage->fresh(),
        ]);
    }

    /**
     * Send a reply directly to the contact by email.
     */
    public function reply(
        Request $request,
        ContactMessage $contactMessage,
        EmailLogService $emailLogService
    ): JsonResponse {
        $validated = $request->validate([
            'reply' => ['required', 'string', 'min:2', 'max:10000'],
        ]);

        $reply = trim($validated['reply']);

        if ($reply === '') {
            return response()->json([
                'success' => false,
                'message' => 'La réponse ne peut pas être vide.',
            ], 422);
        }

        $subject = trim((string) $contactMessage->subject);

        if (!str_starts_with(strtolower($subject), 're:')) {
            $subject = 'Re: ' . $subject;
        }

        $body = $reply . "\n\n"
            . "Cordialement,\n"
            . "L'équipe Mont Djurdjura";

        try {
            $emailLogService->sendRaw([
                'recipient' => $contactMessage->email,
                'subject' => $subject,
                'body' => $body,
                'type' => 'contact_reply',
                'related_type' => ContactMessage::class,
                'related_id' => $contactMessage->id,
                'created_by' => auth()->id(),
            ]);

            // Update the contact message only after successful SMTP sending.
            $contactMessage->reply_message = $reply;
            $contactMessage->status = 'replied';
            $contactMessage->replied_at = now();
            $contactMessage->save();

            return response()->json([
                'success' => true,
                'message' => 'Votre réponse a été envoyée avec succès.',
                'contact_message' => $contactMessage->fresh(),
            ]);
        } catch (Throwable $exception) {
            Log::error('Contact message reply failed.', [
                'contact_message_id' => $contactMessage->id,
                'recipient' => $contactMessage->email,
                'error' => $exception->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => "L'envoi de l'email a échoué. Consultez l'historique des emails pour plus de détails.",
            ], 500);
        }
    }
}
