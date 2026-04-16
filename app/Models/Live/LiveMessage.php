<?php

namespace App\Models\Live;

use App\Events\LiveMessagePublished;
use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LiveMessage extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'content',
        'event_id',
        'sender_id',
        'reviewer_id',
        'reviewed_at',
    ];

    protected $with = [
        'sender',
        'reviewer'
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

    public function event(): BelongsTo
    {
        return $this->belongsTo(LiveEvent::class, 'event_id')
            ->select(['id', 'name','room_id']);
    }

    public function review(User $reviewer, string $reviewedAt): void
    {
        $this->update([
            'reviewed_at' => $reviewedAt,
            'reviewer_id' => $reviewer->id,
        ]);

        LiveMessagePublished::dispatch($this);
    }
}
