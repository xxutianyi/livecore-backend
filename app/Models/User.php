<?php

namespace App\Models;

use App\Models\Live\LiveMessage;
use App\Models\Live\LiveRoom;
use App\Models\Online\UserOnline;
use App\Traits\Filterable;
use App\Traits\Searchable;
use App\Traits\Sortable;
use App\Utils\InviterCode;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;
use RahulHaque\Filepond\Traits\HasFilepond;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasUuids, Searchable, Filterable, Sortable, HasFilepond, HasApiTokens;

    protected $fillable = [
        'name',
        'role',
        'email',
        'phone',
        'password',
        'inviter_code',
        'invitation_code',
        'email_verified_at',
        'phone_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $with = [
    ];

    protected $appends = [
        'online',
        'leaving_at',
        'manageable_groups'
    ];

    protected array $sortable = [
        'name',
        'role',
        'email',
        'phone',
        'inviter_code',
        'invitation_code',
        'created_at',
    ];

    protected array $searchable = [
        'name',
        'email',
        'phone',
    ];

    protected array $filterable = [
        'role',
        'invitation_code'
    ];

    protected function casts(): array
    {
        return [
            'authorities' => 'array',
            'password' => 'hashed',
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (User $user) {

            if (empty($user->password)) {
                $user->password = Hash::make('Password!@');
            }

            if (empty($user->inviter_code)) {
                $user->inviter_code = InviterCode::generate();
            }

        });
    }

    public function onlines(): HasMany
    {
        return $this->hasMany(UserOnline::class)
            ->latest('joined_at')->with(['room', 'event']);
    }

    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(UserGroup::class, 'users_groups')
            ->without(['users', 'parent', 'children'])
            ->withPivot('manageable');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(LiveMessage::class, 'sender_id')
            ->select(['id', 'content', 'event_id', 'sender_id', 'created_at'])
            ->without(['sender', 'reviewer'])
            ->with(['event']);
    }

    public function manageable(): BelongsToMany
    {
        return $this->belongsToMany(LiveRoom::class, 'live_room_managers');
    }

    protected function online(): Attribute
    {
        return Attribute::get(function () {
            return $this->onlines()->first() &&
                $this->onlines()->first()?->leaving_at == null;
        });
    }

    protected function leavingAt(): Attribute
    {
        return Attribute::get(function () {
            return $this->onlines()->first()?->leaving_at;
        });
    }

    protected function manageableGroups(): Attribute
    {
        $groups = collect();

        $this->manageable->each(function (LiveRoom $room) use ($groups) {
            $room->groups->each(function (UserGroup $group) use ($groups) {
                $groups->push($group->id);
            });
        });

        return Attribute::get(function () use ($groups) {
            return $groups;
        });
    }


    public function scopeCanViewBy(Builder $builder, User $user): Builder
    {
        if ($user->can('viewAdmin')) {
            return $builder;
        }

        return $builder->whereRelation('groups',
            function (Builder $builder) use ($user) {
                $builder->whereIn('user_groups.id', $user->manageable_groups);
            });
    }

    public function scopeAdmins(Builder $builder): Builder
    {
        return $builder
            ->where('role', 'admin')
            ->orWhere('role', 'room-admin');
    }

    public function scopeAudiences(Builder $builder): Builder
    {
        return $builder->where('role', 'audience');
    }

    public function scopeWhereGroup(Builder $builder, ?string $group): Builder
    {
        if ($group) {
            $builder->whereRelation('groups',
                function (Builder $builder) use ($group) {
                    $builder->where('user_groups.id', $group);
                });
        }

        return $builder;
    }

    public function scopeWhereOnline(Builder $builder, bool $online): Builder
    {
        if ($online) {
            $builder->whereHas('onlines', function (Builder $builder) {
                $builder->whereNull('leaving_at');
            });
        }

        if (!$online) {
            $builder->whereDoesntHave('onlines')
                ->orWhereHas('onlines', function (Builder $builder) {
                    $builder->whereNotNull('leaving_at');
                });
        }

        return $builder;
    }
}
