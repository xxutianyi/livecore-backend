<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserOnlineHeartbeat extends Model
{
    use HasUuids;

    protected $fillable = [
        'meta',
        'online_id',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    public function online(): BelongsTo
    {
        return $this->belongsTo(UserOnline::class, 'online_id');
    }
}
