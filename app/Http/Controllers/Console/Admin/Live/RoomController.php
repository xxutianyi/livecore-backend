<?php

namespace App\Http\Controllers\Console\Admin\Live;

use App\Http\Controllers\Controller;
use App\Models\Live\LiveRoom;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(Request $request)
    {

        $size = $request->input('size', 10);

        $query = LiveRoom::query()
            ->sort($request->string('sorts'))
            ->search($request->string('search'));

        return inertia('console/admin/live/rooms/index', [
            'data' => $query->paginate($size)->withQueryString()
        ]);
    }
    
    public function show(LiveRoom $room)
    {
        return inertia('console/admin/live/rooms/show', [
            'room' => $room,
            'events' => $room->events,
            'groups' => $room->groups,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        LiveRoom::create($validated);

        return back();
    }

    public function update(Request $request, LiveRoom $room)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $room->update($validated);

        return back();
    }

    public function destroy(LiveRoom $room)
    {
        return to_route('rooms.index');
    }
}
