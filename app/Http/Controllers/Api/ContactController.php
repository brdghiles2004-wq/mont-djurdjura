<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\ContactMessage;
use App\Models\SiteSetting;
use App\Services\AdminNotificationService;
use App\Services\EmailLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class ContactController extends Controller
{
    public function store(
        Request $request,
        EmailLogService $emailLogService,
        AdminNotificationService $adminNotificationService
    ): JsonResponse {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:10000'],
        ]);

        [$client, $contactMessage] = DB::transaction(
            function () use ($validated) {
                $client = Client::syncFromSubmission($validated);

                $contactMessage = new ContactMessage([
                    'name' => $validated['name'],
                    'company' => $validated['company'] ?? null,
                    'email' => $validated['email'],
                    'phone' => $validated['phone'] ?? null,
                    'subject' => $validated['subject'],
                    'message' => $validated['message'],
                    'status' => 'new',
                ]);

                $contactMessage->client()->associate($client);
                $contactMessage->save();

                return [$client, $contactMessage];
            }
        );

        try {
            $adminNotificationService->send(
                'messages.view',
                'contact',
                'Nouveau message de contact',
                "{$contactMessage->name} — {$contactMessage->subject} (Réf. #{$contactMessage->id})",
                'messages',
                (int) $contactMessage->id
            );
        } catch (Throwable $e) {
            Log::error('Contact admin notification failed', [
                'contact_message_id' => $contactMessage->id,
                'error' => $e->getMessage(),
            ]);
        }

        $emailNotificationSent = false;

        $body = "Nouveau message de contact - Mont Djurdjura\n\n";
        $body .= "Référence : #{$contactMessage->id}\n";
        $body .= "Nom : {$contactMessage->name}\n";
        $body .= "Entreprise : " . ($contactMessage->company ?: 'Non renseignée') . "\n";
        $body .= "Email : {$contactMessage->email}\n";
        $body .= "Téléphone : " . ($contactMessage->phone ?: 'Non renseigné') . "\n";
        $body .= "Sujet : {$contactMessage->subject}\n\n";
        $body .= "Message :\n{$contactMessage->message}\n";

        // L'adresse destinataire est récupérée depuis le Dashboard.
        // Si elle est absente, on utilise l'adresse de secours de la configuration.
        $recipient = SiteSetting::query()->value('official_email')
            ?: config('mail.contact_to');

        if ($recipient) {
            try {
                $emailLogService->sendRaw([
                    'recipient' => $recipient,
                    'subject' => 'Nouveau message - Mont Djurdjura',
                    'body' => $body,
                    'type' => 'contact_notification',
                    'related_type' => ContactMessage::class,
                    'related_id' => $contactMessage->id,
                    'reply_to' => [
                        'email' => $contactMessage->email,
                        'name' => $contactMessage->name,
                    ],
                ]);

                $emailNotificationSent = true;
            } catch (Throwable $e) {
                Log::error('Contact email notification failed', [
                    'contact_message_id' => $contactMessage->id,
                    'recipient' => $recipient,
                    'error' => $e->getMessage(),
                ]);
            }
        } else {
            Log::warning('Contact notification email skipped: no recipient configured.', [
                'contact_message_id' => $contactMessage->id,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Votre message a été envoyé avec succès.',
            'data' => [
                'id' => $contactMessage->id,
                'email_notification_sent' => $emailNotificationSent,
            ],
        ], 201);
    }
}
