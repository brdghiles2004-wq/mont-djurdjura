<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\DevisRequest;
use App\Models\SiteSetting;
use App\Services\EmailLogService;
use App\Services\AdminNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class DevisController extends Controller
{
    public function store(
        Request $request,
        EmailLogService $emailLogService,
        AdminNotificationService $adminNotificationService
    ): JsonResponse {
        // Convert numeric quantity values to strings before validation.
        if ($request->has('quantity') && is_numeric($request->input('quantity'))) {
            $request->merge([
                'quantity' => (string) $request->input('quantity'),
            ]);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'product' => ['required', 'string', 'max:255'],
            'quantity' => ['nullable', 'string', 'max:255'],
            'request_type' => [
                'required',
                'string',
                'in:achat_gros,achat_detail,distribution,autre',
            ],
            'message' => ['nullable', 'string', 'max:10000'],
        ]);

        [$client, $devis] = DB::transaction(
            function () use ($validated) {
                $client = Client::syncFromSubmission($validated);

                $devis = new DevisRequest([
                    'name' => $validated['name'],
                    'company' => $validated['company'] ?? null,
                    'email' => $validated['email'],
                    'phone' => $validated['phone'] ?? null,
                    'product' => $validated['product'],
                    'quantity' => $validated['quantity'] ?? null,
                    'request_type' => $validated['request_type'],
                    'message' => $validated['message'] ?? null,
                    'status' => 'new',
                ]);

                $devis->client()->associate($client);
                $devis->save();

                return [$client, $devis];
            }
        );

        try {
            $adminNotificationService->send(
                'devis.view',
                'devis',
                'Nouvelle demande de devis',
                "{$devis->name} — {$devis->product} (Réf. #{$devis->id})",
                'devis',
                (int) $devis->id
            );
        } catch (Throwable $e) {
            Log::error('Devis admin notification failed', [
                'devis_id' => $devis->id,
                'error' => $e->getMessage(),
            ]);
        }

        $requestTypeLabels = [
            'achat_gros' => 'Achat en gros',
            'achat_detail' => 'Achat au détail',
            'distribution' => 'Distribution',
            'autre' => 'Autre demande',
        ];

        $requestTypeLabel = $requestTypeLabels[$devis->request_type]
            ?? $devis->request_type;

        $adminBody = "Nouvelle demande de devis - Mont Djurdjura\n\n";
        $adminBody .= "Référence : #{$devis->id}\n";
        $adminBody .= "Nom : {$devis->name}\n";
        $adminBody .= "Entreprise : " . ($devis->company ?: 'Non renseignée') . "\n";
        $adminBody .= "Email : {$devis->email}\n";
        $adminBody .= "Téléphone : " . ($devis->phone ?: 'Non renseigné') . "\n";
        $adminBody .= "Produit : {$devis->product}\n";
        $adminBody .= "Quantité : " . ($devis->quantity ?: 'Non précisée') . "\n";
        $adminBody .= "Type de demande : {$requestTypeLabel}\n\n";
        $adminBody .= "Message :\n" . ($devis->message ?: 'Aucun message') . "\n";

        // L'adresse de l'entreprise vient du Dashboard.
        $recipient = SiteSetting::query()->value('official_email')
            ?: config('mail.contact_to');

        $adminEmailNotificationSent = false;

        if ($recipient) {
            try {
                $emailLogService->sendRaw([
                    'recipient' => $recipient,
                    'subject' => "Nouvelle demande de devis #{$devis->id} - Mont Djurdjura",
                    'body' => $adminBody,
                    'type' => 'devis_notification',
                    'related_type' => DevisRequest::class,
                    'related_id' => $devis->id,
                ]);

                $adminEmailNotificationSent = true;
            } catch (Throwable $e) {
                Log::error('Devis admin email notification failed', [
                    'devis_id' => $devis->id,
                    'recipient' => $recipient,
                    'error' => $e->getMessage(),
                ]);
            }
        } else {
            Log::warning('Devis admin email skipped: no recipient configured.', [
                'devis_id' => $devis->id,
            ]);
        }

        // Confirmation envoyée au client.
        $customerBody = "Bonjour {$devis->name},\n\n";
        $customerBody .= "Nous avons bien reçu votre demande de devis.\n\n";
        $customerBody .= "Référence : #{$devis->id}\n";
        $customerBody .= "Produit : {$devis->product}\n";
        $customerBody .= "Type de demande : {$requestTypeLabel}\n\n";
        $customerBody .= "Notre équipe commerciale vous contactera dans les meilleurs délais.\n\n";
        $customerBody .= "Cordialement,\n";
        $customerBody .= "L'équipe Mont Djurdjura\n";
        $customerBody .= "contact@montdjurdjura-dz.com\n";

        $customerEmailSent = false;

        try {
            $emailLogService->sendRaw([
                'recipient' => $devis->email,
                'subject' => "Confirmation de votre demande de devis #{$devis->id} - Mont Djurdjura",
                'body' => $customerBody,
                'type' => 'devis_confirmation',
                'related_type' => DevisRequest::class,
                'related_id' => $devis->id,
            ]);

            $customerEmailSent = true;
        } catch (Throwable $e) {
            Log::error('Devis customer confirmation email failed', [
                'devis_id' => $devis->id,
                'customer_email' => $devis->email,
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Votre demande de devis a été envoyée avec succès.',
            'data' => [
                'id' => $devis->id,
                'admin_email_notification_sent' => $adminEmailNotificationSent,
                'customer_email_sent' => $customerEmailSent,
            ],
        ], 201);
    }
}
