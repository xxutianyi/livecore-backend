<?php

namespace App\Models\Live;

use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LiveMessage extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'content',
        'room_id',
        'event_id',
        'sender_id',
        'reviewer_id',
        'reviewed_at',
    ];

    protected $with = [
        'sender',
        'reviewer'
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id')
            ->select(['id', 'name']);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id')
            ->select(['id', 'name']);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(LiveRoom::class, 'room_id')
            ->select(['id', 'name']);
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(LiveEvent::class, 'event_id')
            ->select(['id', 'name']);
    }

    public function review(User $reviewer, CarbonInterface $reviewedAt): void
    {
        $this->update([
            'reviewed_at' => $reviewedAt,
            'reviewer_id' => $reviewer->id,
        ]);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->whereNotNull('reviewed_at');
    }
}
