<?php

namespace App\Console\Commands;

use App\Models\Live\LiveMessage;
use App\Models\Live\LiveRoom;
use App\Models\Online\UserOnline;
use App\Models\Stats\LiveRoomStat;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:collect-room-stats')]
#[Description('获取直播间维度统计数据')]
class CollectRoomStats extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        LiveRoom::each(function (LiveRoom $room) {

            $messageCount = LiveMessage::where('room_id', $room->id)->count();
            $messageReviewedCount = LiveMessage::where('room_id', $room->id)->whereNotNull('reviewed_at')->count();
            $audienceCount = UserOnline::where('room_id', $room->id)->distinct()->pluck('user_id')->count();

            LiveRoomStat::create([
                'room_id' => $room->id,
                'users_count' => $audienceCount,
                'messages_count' => $messageCount,
                'messages_reviewed_count' => $messageReviewedCount,
            ]);
        });
    }
}
