<?php

namespace App\Http\Controllers\Console\Admin\Live;

use App\Http\Controllers\Controller;
use App\Models\Live\LiveRoom;
use App\Utils\FilepondSave;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

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
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'cover' => ['required', Rule::filepond(['mimetypes:image/*'])],
        ]);

        $room = LiveRoom::create($request->only(['name', 'description']));
        $cover = FilepondSave::save($request->cover, "cover/$room->id");
        $room->update(['cover' => $cover]);

        return back();
    }

    public function update(Request $request, LiveRoom $room)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $room->update($request->only(['name', 'description']));

        return back();
    }

    public function destroy(LiveRoom $room)
    {
        return to_route('rooms.index');
    }
}
