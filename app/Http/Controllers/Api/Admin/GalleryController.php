<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

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
     * Store a new gallery image in Cloudinary.
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

        $imagePath = $this->uploadImage($request->file('image'));

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

        if ($request->hasFile('image')) {
            // Upload the new image before updating the database.
            // Keep the old Cloudinary image untouched.
            $validated['image_path'] = $this->uploadImage(
                $request->file('image')
            );

            unset($validated['image']);
        }

        $gallery->update($validated);

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
        // Delete only old local files.
        // Do not delete Cloudinary assets here.
        if (
            $gallery->image_path &&
            !$this->isAbsoluteUrl($gallery->image_path)
        ) {
            Storage::disk('public')->delete($gallery->image_path);
        }

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
     * Upload an image to Cloudinary and return its URL.
     */
    private function uploadImage(UploadedFile $file): string
    {
        $disk = Storage::disk('cloudinary');

        $path = $disk->putFile('gallery', $file);

        if (!$path) {
            throw new RuntimeException(
                'Cloudinary gallery image upload failed.'
            );
        }

        return $disk->url($path);
    }

    /**
     * Check whether a path is already an absolute URL.
     */
    private function isAbsoluteUrl(string $value): bool
    {
        return preg_match('/^https?:\/\//i', $value) === 1;
    }

    /**
     * Format gallery response.
     */
    private function formatGallery(Gallery $gallery): array
    {
        $imagePath = $gallery->image_path;

        $imageUrl = $this->isAbsoluteUrl($imagePath)
            ? $imagePath
            : Storage::disk('public')->url($imagePath);

        return [
            'id' => $gallery->id,
            'title' => $gallery->title,
            'description' => $gallery->description,
            'image_path' => $imagePath,
            'image_url' => $imageUrl,
            'alt_text' => $gallery->alt_text,
            'sort_order' => $gallery->sort_order,
            'is_active' => $gallery->is_active,
            'created_at' => $gallery->created_at,
            'updated_at' => $gallery->updated_at,
        ];
    }
}
