<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    protected $fillable = [
        'name',
        'company',
        'email',
        'phone',
        'address',
        'city',
        'wilaya',
        'notes',
    ];

    /**
     * Find an existing client by email or create one.
     * Update the available contact information.
     */
    public static function syncFromSubmission(array $data): self
    {
        $email = strtolower(trim($data['email']));

        $client = static::query()
            ->whereRaw('LOWER(email) = ?', [$email])
            ->first();

        if (!$client) {
            $client = new static();
            $client->email = $email;
        }

        $client->name = $data['name'];

        if (!empty($data['company'])) {
            $client->company = $data['company'];
        }

        if (!empty($data['phone'])) {
            $client->phone = $data['phone'];
        }

        $client->save();

        return $client;
    }

    public function contactMessages(): HasMany
    {
        return $this->hasMany(ContactMessage::class);
    }

    public function devisRequests(): HasMany
    {
        return $this->hasMany(DevisRequest::class);
    }
}