<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SeoPage;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SeoPageController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => SeoPage::orderBy('page_key')->get(),
        ]);
    }

    public function update(Request $request, string $pageKey)
    {
        $validated = $request->validate([
            'meta_title_fr' => ['nullable', 'string', 'max:255'],
            'meta_title_en' => ['nullable', 'string', 'max:255'],
            'meta_title_ar' => ['nullable', 'string', 'max:255'],

            'meta_description_fr' => ['nullable', 'string', 'max:1000'],
            'meta_description_en' => ['nullable', 'string', 'max:1000'],
            'meta_description_ar' => ['nullable', 'string', 'max:1000'],

            'og_image' => ['nullable', 'string', 'max:2048'],

            'no_index' => ['sometimes', 'boolean'],
            'no_follow' => ['sometimes', 'boolean'],
        ]);

        $allowedPages = [
            'home',
            'about',
            'source',
            'products',
            'gallery',
            'production-process',
            'contact',
            'quote',
            'faq',
            'legal-notice',
            'privacy-policy',
        ];

        if (!in_array($pageKey, $allowedPages, true)) {
            return response()->json([
                'success' => false,
                'message' => 'Unknown SEO page.',
            ], 404);
        }

        $seoPage = SeoPage::firstOrNew([
            'page_key' => $pageKey,
        ]);

        $seoPage->fill($validated);
        $seoPage->save();

        return response()->json([
            'success' => true,
            'message' => 'Page SEO updated successfully.',
            'data' => $seoPage,
        ]);
    }
}
