<?php

use App\Http\Controllers\Api as Api;
use Illuminate\Support\Facades\Route;

Route::post('presence/joined', [Api\UserPresenceController::class, 'joined']);
Route::post('presence/heartbeat', [Api\UserPresenceController::class, 'heartbeat']);
Route::post('presence/leaving', [Api\UserPresenceController::class, 'leaving']);

Route::post('live-callback/push',[Api\LiveCallbackController::class,'push']);
Route::post('live-callback/stop',[Api\LiveCallbackController::class,'stop']);
Route::post('live-callback/record',[Api\LiveCallbackController::class,'record']);
