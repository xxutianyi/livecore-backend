<?php

namespace App\Models\Stats;

use Illuminate\Database\Eloquent\Model;

class LiveRoomStat extends Model
{
    protected $fillable=[
        'room_id',
        'users_count',
        'messages_count',
        'messages_reviewed_count',
    ];
}
