<?php

namespace App\Http\Controllers\Watch;

use App\Http\Controllers\Controller;
use App\Models\Live\LiveRoom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        return inertia('website/rooms/index', [
            'rooms' => LiveRoom::all()->reject(
                function (LiveRoom $room) use ($request) {
                    return Gate::denies('viewLiveRoom', $room);
                })->flatten()
        ]);
    }

    public function show(LiveRoom $room)
    {
        Gate::authorize('viewLiveRoom', $room);

        return inertia('website/rooms/show', [
            'room' => $room,
            'event' => $room->living,
            'messages' => $room->living?->messages()->published()->get()
        ]);
    }
}
