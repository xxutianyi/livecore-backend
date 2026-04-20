<?php

namespace App\Console\Commands;

use App\Models\Live\LiveEvent;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:clear-expired-event')]
#[Description('清理已经过期的直播场次')]
class ClearExpiredEvent extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        LiveEvent::wherePast('expired_at')
            ->whereNull('finished_at')
            ->whereNotNull('started_at')
            ->each(
                function (LiveEvent $liveEvent) {
                    $liveEvent->update(['finished_at' => $liveEvent->expired_at]);
                });
    }
}
