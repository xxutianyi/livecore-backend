<?php

namespace App\Http\Controllers\Console\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Live\CreateRoomRequest;
use App\Http\Requests\Live\UpdateRoomRequest;
use App\Models\Live\LiveRoom;
use App\Utils\FilepondSave;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $size = $request->input('size', 10);

        $data = $request->user()->can('viewAdmin')
            ? LiveRoom::query()
            : $request->user()->manageable();

        $data = $data
            ->sort($request->string('sorts'))
            ->search($request->string('search'))
            ->paginate($size)->withQueryString();

        return inertia('console/settings/rooms/index', ['data' => $data]);
    }

    public function show(LiveRoom $room)
    {
        Gate::authorize('manageLiveRoom', $room);

        return inertia('console/settings/rooms/show', [
            'room' => $room,
            'groups' => $room->groups,
        ]);
    }

    public function store(CreateRoomRequest $request)
    {
        $room = LiveRoom::create($request->only(['name', 'description']));
        $request->user()->manageable()->attach($room);

        $cover = FilepondSave::save($request->cover, "cover/$room->id");
        $room->update(['cover' => $cover]);

        return back();
    }

    public function update(UpdateRoomRequest $request, LiveRoom $room)
    {
        Gate::authorize('manageLiveRoom', $room);

        $room->update($request->only(['name', 'description']));

        return back();
    }

    public function destroy(LiveRoom $room)
    {
        Gate::authorize('manageLiveRoom', $room);

        return to_route('rooms.index');
    }
}
