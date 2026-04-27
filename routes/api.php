<?php

use App\Http\Controllers\Api as Api;
use Illuminate\Support\Facades\Route;

Route::name('api.')->group(function () {
    Route::post('live-callback/push', [Api\LiveCallbackController::class, 'push']);
    Route::post('live-callback/stop', [Api\LiveCallbackController::class, 'stop']);
    Route::post('live-callback/record', [Api\LiveCallbackController::class, 'record']);

    Route::middleware('guest')->group(function () {
        Route::post('login', [Api\Auth\AuthSessionController::class, 'store']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [Api\Auth\AuthSessionController::class, 'destroy']);

        Route::get('profile', [Api\Auth\UserProfileController::class, 'show']);
        Route::post('profile', [Api\Auth\UserProfileController::class, 'update']);
        Route::post('password', [Api\Auth\UserProfileController::class, 'password']);

        Route::post('presence/joined', [Api\UserPresenceController::class, 'joined']);
        Route::post('presence/heartbeat', [Api\UserPresenceController::class, 'heartbeat']);
        Route::post('presence/leaving', [Api\UserPresenceController::class, 'leaving']);

        Route::get('/rooms', [Api\Watch\RoomController::class, 'index']);
        Route::get('/rooms/{room}', [Api\Watch\RoomController::class, 'show']);
        Route::get('/rooms/{room}/events', [Api\Watch\EventController::class, 'index']);
        Route::get('/events/{event}', [Api\Watch\EventController::class, 'show']);
        Route::get('/events/{event}/messages', [Api\Watch\MessageController::class, 'index']);
        Route::post('/events/{event}/messages', [Api\Watch\MessageController::class, 'store']);

        Route::prefix('settings')->group(function () {
            Route::apiResource('users', Api\Settings\UserController::class);
            Route::apiResource('groups', Api\Settings\UserGroupController::class);
            Route::get('/rooms/options', [Api\Settings\RoomController::class, 'options']);
            Route::apiResource('rooms', Api\Settings\RoomController::class);
            Route::put('/rooms/{room}/cover', Api\Settings\RoomCoverController::class);
            Route::put('/rooms/{room}/group', Api\Settings\RoomGroupController::class);
        });

        Route::prefix('systems')->group(function () {
            Route::apiResource('users', Api\System\UserController::class);
            Route::put('/users/{user}/manageable', Api\System\UserManageableController::class);

        });
    });
});
