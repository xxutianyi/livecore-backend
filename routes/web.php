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
            Route::get('rooms', [Console\Admin\Live\RoomController::class, 'index'])->name('rooms.index');
            Route::post('rooms', [Console\Admin\Live\RoomController::class, 'store'])->name('rooms.store');
            Route::get('rooms/{room}', [Console\Admin\Live\RoomController::class, 'show'])->name('rooms.show');
            Route::put('rooms/{room}', [Console\Admin\Live\RoomController::class, 'update'])->name('rooms.update');
            Route::delete('rooms/{room}', [Console\Admin\Live\RoomController::class, 'destroy'])->name('rooms.destroy');

            Route::get('users', [Console\Admin\Live\UserController::class, 'index'])->name('users.index');
            Route::post('users', [Console\Admin\Live\UserController::class, 'store'])->name('users.store');
            Route::get('users/{user}', [Console\Admin\Live\UserController::class, 'show'])->name('users.show');
            Route::put('users/{user}', [Console\Admin\Live\UserController::class, 'update'])->name('users.update');
            Route::delete('users/{user}', [Console\Admin\Live\UserController::class, 'destroy'])->name('users.destroy');
            Route::post('users/batch/group', [Console\Admin\Live\UserBatchController::class, 'group'])->name('users.batch.group');

            Route::post('groups', [Console\Admin\Live\UserGroupController::class, 'store'])->name('groups.store');
            Route::put('groups/{group}', [Console\Admin\Live\UserGroupController::class, 'update'])->name('groups.update');
            Route::delete('groups/{group}', [Console\Admin\Live\UserGroupController::class, 'destroy'])->name('groups.destroy');
        });

        Route::prefix('settings')->name('settings.')->group(function () {
            Route::get('users', [Console\Admin\Settings\UserController::class, 'index'])->name('users.index');
            Route::post('users', [Console\Admin\Settings\UserController::class, 'store'])->name('users.store');
            Route::get('users/{user}', [Console\Admin\Settings\UserController::class, 'show'])->name('users.show');
            Route::put('users/{user}', [Console\Admin\Settings\UserController::class, 'update'])->name('users.update');
            Route::delete('users/{user}', [Console\Admin\Settings\UserController::class, 'destroy'])->name('users.destroy');
            Route::put('/users/{user}/directable',Console\Admin\Settings\UserDirectableController::class)->name('users.directable');
        });
    });

    Route::prefix('broadcast')->name('broadcast.')->group(function () {

    });
});
