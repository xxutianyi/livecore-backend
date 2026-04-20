<?php

namespace App\Providers;

use App\Models\User;
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
        Gate::define('viewAdmin', function (User $user) {
            return $user->role === 'admin';
        });

        Gate::define('viewPulse', function (User $user) {
            return $user->role === 'admin';
        });

        Gate::define('viewBroadcast', function (User $user) {
            return $user->role === 'admin' || $user->role === 'director';
        });
    }
}
