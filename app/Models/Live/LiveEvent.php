<?php

namespace App\Models\Live;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LiveEvent extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'name',
        'cover',
        'description',
        'push_url',
        'pull_url',
        'playback_url',
        'expired_at',
        'started_at',
        'finished_at',
        'room_id',
        'sender_id',
        'content',
    ];

    protected $with = [
        'room'
    ];

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
}
