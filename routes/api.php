<?php

use App\Http\Controllers\Api as Api;
use Illuminate\Support\Facades\Route;

Route::post('presence/joined', [Api\OnlineController::class, 'joined']);
Route::post('presence/heartbeat', [Api\OnlineController::class, 'heartbeat']);
Route::post('presence/leaving', [Api\OnlineController::class, 'leaving']);
