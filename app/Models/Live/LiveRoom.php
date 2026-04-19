<?php

namespace App\Models\Live;

use App\Models\UserGroup;
use App\Traits\Optionable;
use App\Traits\Searchable;
use App\Traits\Sortable;
use App\Utils\LiveRoomPrefix;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LiveRoom extends Model
{
    use HasUuids, HasFactory, Searchable, Sortable, Optionable;

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

    protected array $sortable = [

    ];

    protected array $searchable = [
        'name',
        'description',
    ];

    protected array $filterable = [

    ];

    protected static function booted(): void
    {
        static::creating(function (LiveRoom $room) {

            if (empty($room->slug)) {
                $room->slug = LiveRoomPrefix::generate();
            }

        });
    }

    public function events(): HasMany|LiveRoom
    {
        return $this->hasMany(LiveEvent::class, 'room_id');
    }

    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(UserGroup::class,'live_room_groups');
    }
}
