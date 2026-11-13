<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SiteSettingController extends Controller
{
    private function defaultSettings(): array
    {
        return [
            'phone_primary' => '020 72 34 34',
            'phone_secondary' => '30 30',
            'official_email' => 'contact@montdjurdjura-dz.com',
            'company_address' => 'Arafou, Route N° 26, Chorfa, Bouira, Algérie',
            'fax' => '026 950 570',
            'website' => 'www.montdjurdjura-dz.com',
            'working_days' => [
                'monday',
                'tuesday',
                'wednesday',
                'thursday',
                'saturday',
                'sunday',
            ],
            'opening_time' => '07:00',
            'closing_time' => '16:00',
            'social_links' => [],
        ];
    }

    public function show(): JsonResponse
    {
        $settings = SiteSetting::firstOrCreate(
            ['id' => 1],
            $this->defaultSettings()
        );

        // Compléter uniquement les valeurs nulles d'une ancienne configuration.
        $defaults = $this->defaultSettings();
        $changes = [];

        foreach ([
            'phone_primary',
            'phone_secondary',
            'official_email',
            'company_address',
            'fax',
            'website',
            'working_days',
            'opening_time',
            'closing_time',
            'social_links',
        ] as $field) {
            if ($settings->{$field} === null) {
                $changes[$field] = $defaults[$field];
            }
        }

        if (!empty($changes)) {
            $settings->update($changes);
            $settings->refresh();
        }

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone_primary' => ['nullable', 'string', 'max:30'],
            'phone_secondary' => ['nullable', 'string', 'max:30'],
            'official_email' => ['nullable', 'email', 'max:255'],
            'company_address' => ['nullable', 'string', 'max:1000'],
            'fax' => ['nullable', 'string', 'max:30'],
            'website' => ['nullable', 'string', 'max:255'],

            'working_days' => ['required', 'array'],
            'working_days.*' => [
                'string',
                'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            ],

            'opening_time' => ['nullable', 'date_format:H:i'],
            'closing_time' => ['nullable', 'date_format:H:i'],

            'social_links' => ['sometimes', 'array'],
            'social_links.*.platform' => [
                'required',
                'string',
                'in:facebook,instagram,linkedin,youtube,tiktok,x,whatsapp,custom',
            ],
            'social_links.*.label' => ['nullable', 'string', 'max:50'],
            'social_links.*.url' => [
                'required',
                'url:http,https',
                'max:2048',
            ],
            'social_links.*.enabled' => ['required', 'boolean'],
        ]);

        $settings = SiteSetting::firstOrCreate(
            ['id' => 1],
            $this->defaultSettings()
        );

        $settings->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Paramètres mis à jour avec succès.',
            'data' => $settings->fresh(),
        ]);
    }
}