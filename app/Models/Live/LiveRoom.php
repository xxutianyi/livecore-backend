<?php

namespace App\Models\Live;

use App\Models\UserGroup;
use App\Traits\Optionable;
use App\Traits\Searchable;
use App\Traits\Sortable;
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
        'cover',
        'description',
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

    protected function living(): Attribute
    {
        $event = LiveEvent::where('room_id', $this->id)
            ->whereNull('finished_at')
            ->whereNotNull('started_at')
            ->whereFuture('expired_at')
            ->latest()->first();

        return Attribute::get(function () use ($event) {
            return $event;
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
