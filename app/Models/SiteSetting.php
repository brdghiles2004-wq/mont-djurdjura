<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'phone_primary',
        'phone_secondary',
        'official_email',
        'company_address',
        'fax',
        'website',
        'working_days',
        'opening_time',
        'closing_time',
        'social_links',
    ];

    protected function casts(): array
    {
        return [
            'working_days' => 'array',
            'social_links' => 'array',
        ];
    }
}