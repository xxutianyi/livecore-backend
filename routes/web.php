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
    Route::post('logout', [Auth\LoginController::class, 'destroy'])->name('logout');
    Route::get('profile', [Auth\ProfileController::class, 'show'])->name('profile.show');
    Route::put('profile', [Auth\ProfileController::class, 'update'])->name('profile.update');
    Route::put('password', [Auth\ProfileController::class, 'password'])->name('password.update');

    Route::resource('rooms', Watch\RoomController::class)->only(['index', 'show']);
    Route::resource('rooms.events', Watch\EventController::class)->only(['index', 'show']);
    Route::post('events/{event}/message', [Watch\MessageController::class, 'store'])->name('messages.store');

    Route::middleware('can:viewAdmin')->group(function () {
        Route::get('monitor/pulse', Console\Monitor\PulseController::class)->name('monitor.pulse');

        Route::prefix('systems')->name('systems.')->group(function () {
            Route::resource('users', Console\Systems\UserController::class)->except(['create', 'edit']);
            Route::put('/users/{user}/manageable', Console\Systems\UserManageableController::class)->name('users.manageable');
        });
    });

    Route::middleware('can:viewRoomAdmin')->group(function () {
        Route::prefix('settings')->name('settings.')->group(function () {
            Route::resource('rooms', Console\Settings\RoomController::class)->except(['create', 'edit']);
            Route::put('rooms/{room}/cover', Console\Settings\RoomCoverController::class)->name('rooms.cover');
            Route::put('rooms/{room}/groups', Console\Settings\RoomGroupController::class)->name('rooms.groups');
            Route::resource('users', Console\Settings\UserController::class)->except(['create', 'edit']);
            Route::post('users/batch/group', [Console\Settings\UserBatchController::class, 'group'])->name('users.batch.group');
            Route::resource('groups', Console\Settings\UserGroupController::class)->only(['store', 'update', 'destroy']);

        });

        Route::prefix('broadcast')->name('broadcast.')->group(function () {
            Route::get('statistics/{room?}/{event?}', [Console\Broadcast\StatisticsController::class, 'show'])->name('statistics');

            Route::get('playbacks/{room?}', [Console\Broadcast\PlaybacksController::class, 'index'])->name('playbacks');
            Route::put('playbacks/{room}/{event}', [Console\Broadcast\PlaybacksController::class, 'update'])->name('playbacks.update');
            Route::post('playbacks/{room}/{event}', [Console\Broadcast\PlaybacksController::class, 'upload'])->name('playbacks.upload');

            Route::get('direction/{room?}', [Console\Broadcast\DirectionController::class, 'create'])->name('direction');

            Route::post('direction/{room}/events', [Console\Broadcast\DirectionController::class, 'store'])->name('direction.store');
            Route::get('direction/{room}/events/{event}', [Console\Broadcast\DirectionController::class, 'show'])->name('direction.show');
            Route::put('direction/{room}/events/{event}', [Console\Broadcast\DirectionController::class, 'update'])->name('direction.update');
            Route::delete('direction/{room}/events/{event}', [Console\Broadcast\DirectionController::class, 'destroy'])->name('direction.destroy');

            Route::post('direction/{room}/messages', [Console\Broadcast\MessageController::class, 'store'])->name('message.store');
            Route::put('direction/{room}/messages/{message}', [Console\Broadcast\MessageController::class, 'review'])->name('message.review');

        });
    });

});
