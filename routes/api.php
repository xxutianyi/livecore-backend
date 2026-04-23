<?php

use App\Http\Controllers\Api as Api;
use Illuminate\Support\Facades\Route;

Route::post('presence/joined', [Api\UserPresenceController::class, 'joined']);
Route::post('presence/heartbeat', [Api\UserPresenceController::class, 'heartbeat']);
Route::post('presence/leaving', [Api\UserPresenceController::class, 'leaving']);

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
});
