<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;

class PublicSettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = SiteSetting::find(1);

        if (!$settings) {
            return response()->json([
                'success' => true,
                'data' => null,
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'phone_primary' => $settings->phone_primary,
                'phone_secondary' => $settings->phone_secondary,
                'official_email' => $settings->official_email,
                'company_address' => $settings->company_address,
                'fax' => $settings->fax,
                'website' => $settings->website,
                'working_days' => $settings->working_days ?? [],
                'opening_time' => $settings->opening_time,
                'closing_time' => $settings->closing_time,
                'social_links' => $settings->social_links ?? [],
            ],
        ]);
    }
}