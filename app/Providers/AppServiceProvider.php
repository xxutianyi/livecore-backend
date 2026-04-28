<?php

namespace App\Providers;

use App\Models\Live\LiveRoom;
use App\Models\User;
use App\Models\UserGroup;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('viewPulse', function (User $user) {
            return $user->role === 'admin';
        });

        /**
         * 基于角色的控制：管理员
         */
        Gate::define('viewAdmin', function (User $user) {
            if ($user->currentAccessToken()) {
                return $user->tokenCan('viewAdmin') &&
                    $user->role === 'admin';
            }
            return $user->role === 'admin';
        });

        /**
         * 基于角色的控制：直播间管理员
         */
        Gate::define('viewRoomAdmin', function (User $user) {
            if ($user->currentAccessToken()) {
                return $user->tokenCan('viewRoomAdmin') &&
                    ($user->role === 'admin' || $user->role === 'room-admin');
            }

            return $user->role === 'admin' || $user->role === 'room-admin';
        });

        /**
         * 基于资源的控制：可观看的直播间
         */
        Gate::define('viewLiveRoom', function (User $user, LiveRoom $room) {
            return $user->can('manageLiveRoom', $room)
                || $room->audiences->contains($user->id);
        });

        /**
         * 基于资源的控制：可管理的直播间
         */
        Gate::define('manageLiveRoom', function (User $user, LiveRoom $room) {
            return $user->role === 'admin' ||
                ($user->role === 'room-admin' && $user->manageable->contains($room));
        });

        /**
         * 基于资源的控制：可管理的用户分组
         */
        Gate::define('manageUserGroup', function (User $user, UserGroup $group) {
            return $user->role === 'admin' ||
                ($user->role === 'room-admin' && $user->manageable_groups->contains($group->id));
        });
    }
}
