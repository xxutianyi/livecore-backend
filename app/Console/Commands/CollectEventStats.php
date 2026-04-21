<?php

namespace App\Console\Commands;

use App\Models\Live\LiveEvent;
use App\Models\Live\LiveMessage;
use App\Models\Online\UserOnline;
use App\Models\Stats\LiveEventStat;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:collect-event-stats')]
#[Description('获取直播场次维度统计数据')]
class CollectEventStats extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        LiveEvent::each(function (LiveEvent $event) {

            $messageCount = LiveMessage::where('event_id', $event->id)->count();
            $messageReviewedCount = LiveMessage::where('event_id', $event->id)->whereNotNull('reviewed_at')->count();
            $audienceCount = UserOnline::where('event_id', $event->id)->distinct()->pluck('user_id')->count();

            LiveEventStat::create([
                'event_id' => $event->id,
                'users_count' => $audienceCount,
                'messages_count' => $messageCount,
                'messages_reviewed_count' => $messageReviewedCount,
            ]);
        });
    }
}
