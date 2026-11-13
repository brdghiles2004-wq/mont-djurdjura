<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class PublicProductController extends Controller
{
    public function index(Request $request)
    {
        $locale = $this->resolveLocale($request);

        $products = Product::with([
                'category:id,name,slug',
                'translations',
            ])
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (Product $product) => $this->translateProduct($product, $locale));

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    public function show(Request $request, string $slug)
    {
        $locale = $this->resolveLocale($request);

        $product = Product::with([
                'category:id,name,slug',
                'translations',
            ])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $this->translateProduct($product, $locale),
        ]);
    }

    private function resolveLocale(Request $request): string
    {
        $locale = $request->query('locale', 'fr');

        return in_array($locale, ['fr', 'en', 'ar'], true)
            ? $locale
            : 'fr';
    }

    private function translateProduct(Product $product, string $locale): Product
    {
        $translation = $product->getTranslation($locale)
            ?? $product->getTranslation('fr');

        if ($translation) {
            $product->name = $translation->name;
            $product->short_description = $translation->short_description;
            $product->description = $translation->description;
        }

        return $product;
    }
}
