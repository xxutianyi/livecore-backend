<?php

namespace App\Models;

use App\Traits\Optionable;
use App\Traits\Searchable;
use App\Traits\Sortable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserGroup extends Model
{
    use HasUuids, Sortable, Searchable, Optionable;

    protected $fillable = [
        'name',
        'parent_id',
    ];

    protected $withCount = [
        'users',
    ];

    protected array $sortable = [
        'name',
        'users_count',
    ];

    protected array $searchable = [
        'name'
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'users_groups')
            ->withPivot('manageable');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(UserGroup::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(UserGroup::class, 'parent_id');
    }
}
