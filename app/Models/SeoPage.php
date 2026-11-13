<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeoPage extends Model
{
    protected $fillable = [
        'page_key',
        'meta_title_fr',
        'meta_title_en',
        'meta_title_ar',
        'meta_description_fr',
        'meta_description_en',
        'meta_description_ar',
        'og_image',
        'no_index',
        'no_follow',
    ];

    protected function casts(): array
    {
        return [
            'no_index' => 'boolean',
            'no_follow' => 'boolean',
        ];
    }
}
