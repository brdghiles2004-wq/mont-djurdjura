<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('products')
            ->orderBy('sort_order')
            ->latest()
            ->paginate(15);

        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:categories,slug'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:5120'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ]);

        $validated['slug'] = $this->generateSlug(
            $validated['slug'] ?? $validated['name']
        );

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')
                ->store('categories', 'public');
        }

        $category = Category::create($validated);

        return response()->json([
            'message' => 'Category created successfully.',
            'category' => $category->loadCount('products'),
        ], 201);
    }

    public function show(Category $category)
    {
        return response()->json(
            $category->loadCount('products')
        );
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
                Rule::unique('categories', 'slug')->ignore($category->id),
            ],
            'description' => ['sometimes', 'nullable', 'string'],
            'image' => ['sometimes', 'nullable', 'image', 'max:5120'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ]);

        if (isset($validated['name']) && !isset($validated['slug'])) {
            $validated['slug'] = $validated['name'];
        }

        if (isset($validated['slug'])) {
            $validated['slug'] = $this->generateSlug(
                $validated['slug'],
                $category->id
            );
        }

        if ($request->hasFile('image')) {
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }

            $validated['image'] = $request->file('image')
                ->store('categories', 'public');
        }

        $category->update($validated);

        return response()->json([
            'message' => 'Category updated successfully.',
            'category' => $category->fresh()->loadCount('products'),
        ]);
    }

    public function destroy(Category $category)
    {
        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully.',
        ]);
    }

    private function generateSlug(string $value, ?int $ignoreId = null): string
    {
        $slug = Str::slug($value);

        if ($slug === '') {
            $slug = 'category';
        }

        $original = $slug;
        $counter = 1;

        while (
            Category::where('slug', $slug)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $original . '-' . $counter++;
        }

        return $slug;
    }
}