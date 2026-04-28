<?php

namespace App\Http\Controllers\Api\Watch;

use App\Http\Controllers\Controller;
use App\Models\Live\LiveEvent;
use App\Models\Live\LiveRoom;
use App\Response\ApiResponse;
use Illuminate\Support\Facades\Gate;

class EventController extends Controller
{
    public function index(LiveRoom $room)
    {
        Gate::authorize('viewLiveRoom', $room);

        return ApiResponse::success($room->events()->published()->get());
    }

    public function show(LiveEvent $event)
    {
        Gate::authorize('viewLiveRoom', $event->room);
        unset($event->room);

        if (!$event->published) {
            return ApiResponse::unAuthorized();
        }
        
        return ApiResponse::success($event);
    }
}
