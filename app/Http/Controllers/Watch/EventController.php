<?php

namespace App\Http\Controllers\Watch;

use App\Http\Controllers\Controller;
use App\Models\Live\LiveEvent;
use App\Models\Live\LiveRoom;
use Illuminate\Support\Facades\Gate;

class EventController extends Controller
{
    public function index(LiveRoom $room)
    {
        Gate::authorize('viewLiveRoom', $room);

        return inertia('website/events/index', [
            'room' => $room,
            'events' => $room->events()->published()->get()
        ]);
    }

    public function show(LiveRoom $room, LiveEvent $event)
    {
        Gate::authorize('viewLiveRoom', $room);
        
        if (!$event->published) {
            abort(403);
        }

        return inertia('website/events/show', [
            'room' => $room,
            'event' => $event,
            'events' => $room->events()->published()->get(),
            'messages' => $event->messages()->published()->get(),
        ]);
    }
}
