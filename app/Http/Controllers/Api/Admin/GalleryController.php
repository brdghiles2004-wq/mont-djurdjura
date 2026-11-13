<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class GalleryController extends Controller
{
    /**
     * Display all gallery images for admin.
     */
    public function index(Request $request)
    {
        $query = Gallery::query()
            ->orderBy('sort_order')
            ->orderByDesc('created_at');

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('is_active') && $request->input('is_active') !== '') {
            $query->where(
                'is_active',
                filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN)
            );
        }

        $gallery = $query->paginate(12);

        $gallery->getCollection()->transform(function ($item) {
            return $this->formatGallery($item);
        });

        return response()->json([
            'success' => true,
            'data' => $gallery,
        ]);
    }

    /**
     * Display one gallery image.
     */
    public function show(Gallery $gallery)
    {
        return response()->json([
            'success' => true,
            'data' => $this->formatGallery($gallery),
        ]);
    }

    /**
     * Store a new gallery image.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:5000'],
            'image' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:65535'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $imagePath = $request->file('image')->store('gallery', 'public');

        $gallery = Gallery::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'image_path' => $imagePath,
            'alt_text' => $validated['alt_text'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Image added to gallery successfully.',
            'data' => $this->formatGallery($gallery),
        ], 201);
    }

    /**
     * Update a gallery image.
     */
    public function update(Request $request, Gallery $gallery)
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:150'],
            'description' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'image' => [
                'sometimes',
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
            'alt_text' => ['sometimes', 'nullable', 'string', 'max:255'],
            'sort_order' => ['sometimes', 'integer', 'min:0', 'max:65535'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $oldImagePath = null;

        if ($request->hasFile('image')) {
            $oldImagePath = $gallery->image_path;

            $validated['image_path'] = $request->file('image')
                ->store('gallery', 'public');

            unset($validated['image']);
        }

        $gallery->update($validated);

        if ($oldImagePath) {
            Storage::disk('public')->delete($oldImagePath);
        }

        return response()->json([
            'success' => true,
            'message' => 'Gallery image updated successfully.',
            'data' => $this->formatGallery($gallery->fresh()),
        ]);
    }

    /**
     * Delete a gallery image.
     */
    public function destroy(Gallery $gallery)
    {
        Storage::disk('public')->delete($gallery->image_path);

        $gallery->delete();

        return response()->json([
            'success' => true,
            'message' => 'Gallery image deleted successfully.',
        ]);
    }

    /**
     * Public gallery: only active images.
     */
    public function publicIndex()
    {
        $gallery = Gallery::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($item) => $this->formatGallery($item));

        return response()->json([
            'success' => true,
            'data' => $gallery,
        ]);
    }

    /**
     * Format gallery response.
     */
    private function formatGallery(Gallery $gallery): array
    {
        return [
            'id' => $gallery->id,
            'title' => $gallery->title,
            'description' => $gallery->description,
            'image_path' => $gallery->image_path,
            'image_url' => Storage::disk('public')->url($gallery->image_path),
            'alt_text' => $gallery->alt_text,
            'sort_order' => $gallery->sort_order,
            'is_active' => $gallery->is_active,
            'created_at' => $gallery->created_at,
            'updated_at' => $gallery->updated_at,
        ];
    }
}