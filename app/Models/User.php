<?php

namespace App\Models;

use App\Models\Live\LiveMessage;
use App\Traits\Filterable;
use App\Traits\Searchable;
use App\Traits\Sortable;
use App\Utils\InviterCode;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasUuids, Searchable, Filterable, Sortable;

    protected $fillable = [
        'name',
        'role',
        'email',
        'phone',
        'email_verified_at',
        'phone_verified_at',
        'authorities',
        'external_id',
        'password',
        'inviter_code',
        'invitation_code',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = [
        'online',
        'leaving_at'
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

            if (empty($user->inviter_code)) {
                $user->inviter_code = InviterCode::generate();
            }

        });
    }

    public function messages(): HasMany
    {
        return $this->hasMany(LiveMessage::class, 'sender_id')
            ->select(['id', 'content', 'event_id', 'sender_id', 'created_at'])
            ->without(['sender', 'reviewer'])
            ->with(['event']);
    }

    public function onlines(): HasMany
    {
        return $this->hasMany(UserOnline::class)
            ->latest('joined_at')
            ->withCount(['heartbeats'])
            ->with(['heartbeats']);
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
