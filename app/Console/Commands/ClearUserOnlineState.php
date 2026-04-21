<?php

namespace App\Console\Commands;

use App\Models\Online\UserOnline;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

#[Signature('app:clear-online')]
#[Description('清除掉线用户在线状态')]
class ClearUserOnlineState extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        UserOnline::whereNull('leaving_at')->get()
            ->each(function (UserOnline $userOnline) {
                $cacheKey = "user-online-$userOnline->user_id-$userOnline->event_id";

                if (!Cache::has($cacheKey)) {
                    $userOnline->update(['leaving_at' => now()]);
                }
            });
    }
}
