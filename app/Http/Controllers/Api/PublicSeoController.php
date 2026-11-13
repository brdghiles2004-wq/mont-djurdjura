<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SeoPage;
use App\Models\SiteSeoSetting;

class PublicSeoController extends Controller
{
    public function settings()
    {
        $settings = SiteSeoSetting::first();

        if (!$settings) {
            return response()->json([
                'success' => true,
                'data' => null,
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'site_name_fr' => $settings->site_name_fr,
                'site_name_en' => $settings->site_name_en,
                'site_name_ar' => $settings->site_name_ar,

                'default_meta_title_fr' => $settings->default_meta_title_fr,
                'default_meta_title_en' => $settings->default_meta_title_en,
                'default_meta_title_ar' => $settings->default_meta_title_ar,

                'default_meta_description_fr' => $settings->default_meta_description_fr,
                'default_meta_description_en' => $settings->default_meta_description_en,
                'default_meta_description_ar' => $settings->default_meta_description_ar,

                'default_og_image' => $settings->default_og_image,
                'robots_index' => $settings->robots_index,
                'robots_follow' => $settings->robots_follow,

                'google_site_verification' => $settings->google_site_verification,
                'bing_site_verification' => $settings->bing_site_verification,
            ],
        ]);
    }

    public function page(string $pageKey)
    {
        $page = SeoPage::where('page_key', $pageKey)->first();

        return response()->json([
            'success' => true,
            'data' => $page,
        ]);
    }
}
