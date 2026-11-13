<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSeoSetting;
use Illuminate\Http\Request;

class SiteSeoSettingController extends Controller
{
    public function show()
    {
        $settings = SiteSeoSetting::firstOrCreate([]);

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'site_name_fr' => ['nullable', 'string', 'max:255'],
            'site_name_en' => ['nullable', 'string', 'max:255'],
            'site_name_ar' => ['nullable', 'string', 'max:255'],

            'default_meta_title_fr' => ['nullable', 'string', 'max:255'],
            'default_meta_title_en' => ['nullable', 'string', 'max:255'],
            'default_meta_title_ar' => ['nullable', 'string', 'max:255'],

            'default_meta_description_fr' => ['nullable', 'string', 'max:1000'],
            'default_meta_description_en' => ['nullable', 'string', 'max:1000'],
            'default_meta_description_ar' => ['nullable', 'string', 'max:1000'],

            'default_og_image' => ['nullable', 'string', 'max:2048'],

            'robots_index' => ['sometimes', 'boolean'],
            'robots_follow' => ['sometimes', 'boolean'],

            'google_site_verification' => ['nullable', 'string', 'max:255'],
            'bing_site_verification' => ['nullable', 'string', 'max:255'],
        ]);

        $settings = SiteSeoSetting::firstOrCreate([]);
        $settings->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'SEO settings updated successfully.',
            'data' => $settings->fresh(),
        ]);
    }
}
