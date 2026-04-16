<?php

namespace App\Models\Live;

use App\Utils\LiveRoomPrefix;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LiveRoom extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'cover',
        'description',
        'manageable_users',
    ];

    protected $casts = [
        'manageable_users' => 'array',
    ];

    protected static function booted(): void
    {
        static::creating(function (LiveRoom $room) {

            if (empty($room->prefix)) {
                $room->prefix = LiveRoomPrefix::generate();
            }

        });
    }

    public function events(): HasMany|LiveRoom
    {
        return $this->hasMany(LiveEvent::class, 'room_id');
    }
}
