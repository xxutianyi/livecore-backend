<?php

namespace App\Console\Commands;

use App\Models\Online\UserOnline;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

#[Signature('app:clear-online')]
#[Description('清除掉线用户在线状态')]
class ClearOnline extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        UserOnline::whereNull('leaving_at')->get()
            ->each(function (UserOnline $userOnline) {
                $cacheKey = "user-online-$userOnline->user_id";

                if (!Cache::has($cacheKey) || Cache::get($cacheKey) != $userOnline->id) {
                    $userOnline->leaving_at = $userOnline->heartbeats()->first()?->created_at ?? now();
                    $userOnline->save();
                }
            });
    }
}
