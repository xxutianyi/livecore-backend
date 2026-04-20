<?php

namespace App\Http\Controllers\Watch;

use App\Http\Controllers\Controller;
use App\Models\Live\LiveRoom;

class RoomController extends Controller
{
    public function index()
    {
        return inertia('website/rooms/index', [
            'rooms' => LiveRoom::all()
        ]);
    }

    public function show(LiveRoom $room)
    {
        return inertia('website/rooms/show', [
            'room' => $room,
            //'event' => $room->events->first(),
            'messages' => $room->events->first()?->messages
        ]);
    }
}
