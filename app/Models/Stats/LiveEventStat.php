<?php

namespace App\Models\Stats;

use Illuminate\Database\Eloquent\Model;

class LiveEventStat extends Model
{
    protected $fillable=[
        'event_id',
        'users_count',
        'messages_count',
        'messages_reviewed_count',
    ];
}
