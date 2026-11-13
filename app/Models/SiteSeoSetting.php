<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSeoSetting extends Model
{
    protected $fillable = [
        'site_name_fr',
        'site_name_en',
        'site_name_ar',
        'default_meta_title_fr',
        'default_meta_title_en',
        'default_meta_title_ar',
        'default_meta_description_fr',
        'default_meta_description_en',
        'default_meta_description_ar',
        'default_og_image',
        'robots_index',
        'robots_follow',
        'google_site_verification',
        'bing_site_verification',
    ];

    protected function casts(): array
    {
        return [
            'robots_index' => 'boolean',
            'robots_follow' => 'boolean',
        ];
    }
}
