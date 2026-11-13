<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DevisRequest extends Model
{
    protected $fillable = [
        'client_id',
        'name',
        'company',
        'email',
        'phone',
        'product',
        'quantity',
        'request_type',
        'message',
        'status',
        'internal_notes',
        'replied_at',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'replied_at' => 'datetime',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}