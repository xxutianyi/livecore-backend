<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'secret',
        'whitelist',
    ];

    protected $casts = [
        'secret' => 'hashed',
        'whitelist' => 'collection',
    ];


    protected static function booted(): void
    {
        static::creating(function (Client $client) {

            if (empty($client->whitelist)) {
                $client->whitelist = [];
            }

        });
    }
}
