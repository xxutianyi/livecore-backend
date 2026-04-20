<?php

namespace App\Models\Online;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class UserOnline extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'joined_at',
        'leaving_at',
    ];

    protected $casts = [
        'joined_at' => 'datetime',
        'leaving_at' => 'datetime',
    ];

    public function heartbeats(): HasMany
    {
        return $this->hasMany(UserOnlineHeartbeat::class, 'online_id')
            ->latest();
    }

    public static function joined(User $user, string $joinedAt): UserOnline
    {
        $cacheKey = "user-online-$user->id";

        $online = Cache::get($cacheKey);

        if ($online) {
            $online = UserOnline::find($online);
        } else {
            $online = UserOnline::create(['user_id' => $user->id, 'joined_at' => $joinedAt]);
        }

        Cache::put($cacheKey, $online->id, now()->addSeconds(60));

        return $online;
    }
}
