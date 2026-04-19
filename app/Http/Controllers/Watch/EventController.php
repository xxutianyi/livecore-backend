<?php

namespace App\Http\Controllers\Watch;

use App\Http\Controllers\Controller;
use App\Models\Live\LiveEvent;
use App\Models\Live\LiveRoom;

class EventController extends Controller
{
    public function index(LiveRoom $room)
    {
        return inertia('watch/events/index', [
            'room' => $room,
            'events' => $room->events()->published()->get()
        ]);
    }

    public function show(LiveRoom $room, LiveEvent $event)
    {
        if (!$event->published) {
            abort(403);
        }

        return inertia('watch/events/show', [
            'room' => $room,
            'event' => $event,
            'events' => $room->events()->published()->get(),
            'messages' => $event->messages()->published()->get(),
        ]);
    }
}
