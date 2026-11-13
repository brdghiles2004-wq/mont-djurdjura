<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductTranslation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with([
                'category:id,name,slug',
                'translations',
            ])
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->input('search');

                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('reference', 'like', "%{$search}%")
                        ->orWhereHas('translations', function ($translationQuery) use ($search) {
                            $translationQuery->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($request->filled('category_id'), function ($query) use ($request) {
                $query->where('category_id', $request->integer('category_id'));
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('is_active', $request->input('status') === 'active');
            })
            ->orderBy('sort_order')
            ->latest()
            ->paginate(15);

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug'],
            'reference' => ['nullable', 'string', 'max:255', 'unique:products,reference'],
            'short_description' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'main_image' => ['nullable', 'image', 'max:5120'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],

            'translations' => ['sometimes', 'array'],
            'translations.fr.name' => ['required_with:translations', 'string', 'max:255'],
            'translations.fr.short_description' => ['nullable', 'string'],
            'translations.fr.description' => ['nullable', 'string'],

            'translations.en.name' => ['nullable', 'string', 'max:255'],
            'translations.en.short_description' => ['nullable', 'string'],
            'translations.en.description' => ['nullable', 'string'],

            'translations.ar.name' => ['nullable', 'string', 'max:255'],
            'translations.ar.short_description' => ['nullable', 'string'],
            'translations.ar.description' => ['nullable', 'string'],
        ]);

        $translations = $validated['translations'] ?? null;
        unset($validated['translations']);

        if ($translations && !empty($translations['fr']['name'])) {
            $validated['name'] = $translations['fr']['name'];
            $validated['short_description'] =
                $translations['fr']['short_description'] ?? null;
            $validated['description'] =
                $translations['fr']['description'] ?? null;
        }

        $validated['slug'] = $this->generateSlug(
            $validated['slug'] ?? $validated['name']
        );

        if ($request->hasFile('main_image')) {
            $validated['main_image'] = $request->file('main_image')
                ->store('products', 'public');
        }

        $product = Product::create($validated);

        if ($translations !== null) {
            $this->saveTranslations($product, $translations);
        }

        return response()->json([
            'message' => 'Product created successfully.',
            'product' => $product->load(['category', 'translations']),
        ], 201);
    }

    public function show(Product $product)
    {
        return response()->json(
            $product->load(['category', 'translations'])
        );
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => ['sometimes', 'nullable', 'integer', 'exists:categories,id'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
                Rule::unique('products', 'slug')->ignore($product->id),
            ],
            'reference' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
                Rule::unique('products', 'reference')->ignore($product->id),
            ],
            'short_description' => ['sometimes', 'nullable', 'string'],
            'description' => ['sometimes', 'nullable', 'string'],
            'main_image' => ['sometimes', 'nullable', 'image', 'max:5120'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],

            'translations' => ['sometimes', 'array'],
            'translations.fr.name' => ['required_with:translations', 'string', 'max:255'],
            'translations.fr.short_description' => ['nullable', 'string'],
            'translations.fr.description' => ['nullable', 'string'],

            'translations.en.name' => ['nullable', 'string', 'max:255'],
            'translations.en.short_description' => ['nullable', 'string'],
            'translations.en.description' => ['nullable', 'string'],

            'translations.ar.name' => ['nullable', 'string', 'max:255'],
            'translations.ar.short_description' => ['nullable', 'string'],
            'translations.ar.description' => ['nullable', 'string'],
        ]);

        $translations = $validated['translations'] ?? null;
        unset($validated['translations']);

        if ($translations && !empty($translations['fr']['name'])) {
            $validated['name'] = $translations['fr']['name'];
            $validated['short_description'] =
                $translations['fr']['short_description'] ?? null;
            $validated['description'] =
                $translations['fr']['description'] ?? null;
        }

        if (isset($validated['name']) && !isset($validated['slug'])) {
            $validated['slug'] = $validated['name'];
        }

        if (isset($validated['slug'])) {
            $validated['slug'] = $this->generateSlug(
                $validated['slug'],
                $product->id
            );
        }

        if ($request->hasFile('main_image')) {
            if ($product->main_image) {
                Storage::disk('public')->delete($product->main_image);
            }

            $validated['main_image'] = $request->file('main_image')
                ->store('products', 'public');
        }

        $product->update($validated);

        if ($translations !== null) {
            $this->saveTranslations($product, $translations);
        }

        return response()->json([
            'message' => 'Product updated successfully.',
            'product' => $product->fresh()->load(['category', 'translations']),
        ]);
    }

    public function destroy(Product $product)
    {
        if ($product->main_image) {
            Storage::disk('public')->delete($product->main_image);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully.',
        ]);
    }

    private function saveTranslations(Product $product, array $translations): void
    {
        foreach (['fr', 'en', 'ar'] as $locale) {
            $data = $translations[$locale] ?? [];
            $name = trim($data['name'] ?? '');

            if ($name === '') {
                if ($locale !== 'fr') {
                    ProductTranslation::where('product_id', $product->id)
                        ->where('locale', $locale)
                        ->delete();
                }

                continue;
            }

            ProductTranslation::updateOrCreate(
                [
                    'product_id' => $product->id,
                    'locale' => $locale,
                ],
                [
                    'name' => $name,
                    'short_description' => $data['short_description'] ?? null,
                    'description' => $data['description'] ?? null,
                ]
            );
        }
    }

    private function generateSlug(string $value, ?int $ignoreId = null): string
    {
        $slug = Str::slug($value);

        if ($slug === '') {
            $slug = 'product';
        }

        $original = $slug;
        $counter = 1;

        while (
            Product::where('slug', $slug)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $original . '-' . $counter++;
        }

        return $slug;
    }
}
