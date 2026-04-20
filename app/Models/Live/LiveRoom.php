<?php

namespace App\Models\Live;

use App\Models\UserGroup;
use App\Traits\Optionable;
use App\Traits\Searchable;
use App\Traits\Sortable;
use App\Utils\LiveRoomPrefix;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
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

    protected $appends = [
        'living'
    ];

    protected $withCount = [
        'events'
    ];

    protected static function booted(): void
    {
        static::creating(function (LiveRoom $room) {

            if (empty($room->slug)) {
                $room->slug = LiveRoomPrefix::generate();
            }

        });
    }

    protected function living(): Attribute
    {
        $event = $this->whereRelation('events',
            function (Builder $builder) {
                $builder
                    ->whereNull('finished_at')
                    ->whereNotNull('started_at');
            });

        return Attribute::get(function () use ($event) {
            return $event->latest()->first();
        });
    }

    public function events(): HasMany|LiveRoom
    {
        return $this->hasMany(LiveEvent::class, 'room_id')
            ->latest('started_at')->latest();
    }

    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(UserGroup::class, 'live_room_groups');
    }
}
