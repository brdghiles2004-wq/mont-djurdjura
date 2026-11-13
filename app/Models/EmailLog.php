<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmailLog extends Model
{
    protected $fillable = [
        'recipient',
        'cc',
        'bcc',
        'subject',
        'body_html',
        'body_text',
        'type',
        'status',
        'error_message',
        'message_id',
        'related_type',
        'related_id',
        'attempt_count',
        'last_attempt_at',
        'sent_at',
        'created_by',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'cc' => 'array',
            'bcc' => 'array',
            'metadata' => 'array',
            'attempt_count' => 'integer',
            'last_attempt_at' => 'datetime',
            'sent_at' => 'datetime',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
