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

        Gate::define('viewAdmin', function (User $user) {
            return $user->role === 'admin';
        });

        Gate::define('viewRoomAdmin', function (User $user) {
            return $user->role === 'admin' || $user->role === 'room-admin';
        });

        Gate::define('viewLiveRoom', function (User $user, LiveRoom $room) {
            return $user->can('manageLiveRoom', $room)
                || $room->audiences->contains($user->id);
        });

        Gate::define('manageLiveRoom', function (User $user, LiveRoom $room) {
            return $user->role === 'admin' ||
                ($user->role === 'room-admin' && $user->manageable->contains($room));
        });

        Gate::define('manageUserGroup', function (User $user, UserGroup $group) {
            return $user->role === 'admin' ||
                ($user->role === 'room-admin' && $user->manageable_groups->contains($group->id));
        });
    }
}
