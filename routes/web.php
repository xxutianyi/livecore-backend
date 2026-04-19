<?php

use App\Http\Controllers\Auth as Auth;
use App\Http\Controllers\Console as Console;
use App\Http\Controllers\Watch as Watch;
use Illuminate\Support\Facades\Route;


Route::middleware('guest')->group(function () {
    Route::get('/', fn() => inertia('welcome'));
    Route::get('login', [Auth\LoginController::class, 'show']);
    Route::post('login', [Auth\LoginController::class, 'store']);

});

Route::middleware('auth')->group(function () {
    Route::post('logout', [Auth\LoginController::class, 'destroy']);
    Route::get('profile', [Auth\ProfileController::class, 'show']);
    Route::put('profile', [Auth\ProfileController::class, 'update']);
    Route::put('password', [Auth\ProfileController::class, 'password']);

    Route::resource('rooms', Watch\RoomController::class)->only(['index', 'show']);
    Route::resource('rooms.events', Watch\EventController::class)->only(['index', 'show']);
    Route::post('events/{event}/message', [Watch\MessageController::class, 'store'])->name('messages.store');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', Console\DashboardController::class)->name('dashboard');
        Route::get('monitor/pulse', Console\Admin\MonitorController::class)->name('monitor');

        Route::prefix('live')->name('live.')->group(function () {
            Route::resource('rooms', Console\Admin\Live\RoomController::class)->except(['create', 'edit']);
            Route::put('rooms/{room}/groups', Console\Admin\Live\RoomGroupController::class)->name('rooms.groups');
            Route::resource('users', Console\Admin\Live\UserController::class)->except(['create', 'edit']);
            Route::post('users/batch/group', [Console\Admin\Live\UserBatchController::class, 'group'])->name('users.batch.group');
            Route::resource('groups', Console\Admin\Live\UserGroupController::class)->only(['store', 'update', 'destroy']);
        });

        Route::prefix('settings')->name('settings.')->group(function () {
            Route::resource('users', Console\Admin\Settings\UserController::class)->except(['create', 'edit']);
            Route::put('/users/{user}/directable', Console\Admin\Settings\UserDirectableController::class)->name('users.directable');
        });
    });

    Route::prefix('broadcast')->name('broadcast.')->group(function () {

    });
});
