<?php

namespace App\Models;

use App\Models\Live\LiveRoom;
use App\Traits\Optionable;
use App\Traits\Searchable;
use App\Traits\Sortable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserGroup extends Model
{
    use HasUuids, Sortable, Searchable, Optionable;

    protected $with = [
        'rooms'
    ];

    protected $fillable = [
        'name',
        'parent_id',
    ];

    protected array $sortable = [
        'name',
    ];

    protected array $searchable = [
        'name'
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'users_groups')
            ->withPivot('manageable');
    }

    public function rooms(): BelongsToMany
    {
        return $this->belongsToMany(LiveRoom::class, 'live_room_groups')
            ->select(['live_rooms.id', 'live_rooms.name']);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(UserGroup::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(UserGroup::class, 'parent_id');
    }

    public function scopeCanViewBy(Builder $builder, User $user): Builder
    {
        if ($user->can('viewAdmin')) {
            return $builder;
        }

        return $builder->whereIn('id', $user->manageable_groups);
    }
}
