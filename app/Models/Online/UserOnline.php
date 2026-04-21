<?php

namespace App\Models\Online;

use App\Models\Live\LiveEvent;
use App\Models\Live\LiveRoom;
use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Cache;

class UserOnline extends Model
{
    use HasUuids;

    protected $fillable = [
        'living',
        'user_id',
        'room_id',
        'event_id',
        'joined_at',
        'leaving_at',
    ];

    protected $casts = [
        'joined_at' => 'datetime',
        'leaving_at' => 'datetime',
    ];

    public static function heartbeat(array $data): UserOnline
    {
        $cacheKey = "user-online-{$data['user_id']}-{$data['event_id']}";

        $online = Cache::get($cacheKey);

        if ($online) {
            $online = UserOnline::find($online);
            $online->update(['leaving_at' => null]);
        } else {
            $online = UserOnline::create($data);
        }

        Cache::put($cacheKey, $online->id, now()->addSeconds(30));

        return $online;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(LiveRoom::class, 'room_id');
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(LiveEvent::class, 'event_id');
    }
}
