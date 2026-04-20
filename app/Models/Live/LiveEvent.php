<?php

namespace App\Models\Live;

use App\Traits\Searchable;
use App\Traits\Sortable;
use App\Utils\TencentLive;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LiveEvent extends Model
{
    use HasUuids, HasFactory, Sortable, Searchable;

    protected $fillable = [
        'name',
        'cover',
        'room_id',
        'published',
        'description',
        'push_url',
        'pull_url',
        'playback_url',
        'expired_at',
        'started_at',
        'finished_at',
    ];

    protected $casts = [
        'expired_at' => 'datetime',
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
    ];

    protected $with = [
        'room'
    ];

    protected array $sortable = [
        'started_at',
        'finished_at',
    ];

    protected array $searchable = [
        'name',
        'description',
    ];

    protected array $filterable = [

    ];


    protected static function booted(): void
    {
        static::creating(function (LiveEvent $event) {
            $expire = now()->addHours(4);
            $tencent = new TencentLive($event, $expire);

            $event->push_url = $tencent->generatePushUrl();
            $event->pull_url = $tencent->generatePullUrl();
            $event->expired_at = $expire;
        });
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(LiveRoom::class, 'room_id')
            ->select(['id', 'name']);
    }

    public function messages(): LiveEvent|HasMany
    {
        return $this->hasMany(LiveMessage::class, 'event_id')
            ->oldest('reviewed_at')->oldest();
    }

    public function scopePublished(Builder $query, bool $published = true): Builder
    {
        return $query->where('published', $published);
    }
}
