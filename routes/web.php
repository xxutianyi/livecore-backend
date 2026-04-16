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

    Route::prefix('console')->group(function () {
        Route::get('/', Console\DashboardController::class);


        Route::resource('live-room/rooms', Console\LiveRoom\RoomController::class);

        Route::resource('live-room/users', Console\LiveRoom\UserController::class)
            ->only(['index', 'show', 'store', 'update', 'destroy']);

        Route::resource('live-room/groups', Console\LiveRoom\UserGroupController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        Route::post('live-room/users/batch/group', [Console\LiveRoom\UserBatchController::class, 'group'])
            ->name('users.batch.group');

    });
});
