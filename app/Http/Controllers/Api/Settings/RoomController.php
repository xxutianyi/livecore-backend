<?php

namespace App\Http\Controllers\Api\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Live\CreateRoomRequest;
use App\Http\Requests\Live\UpdateRoomRequest;
use App\Models\Live\LiveRoom;
use App\Response\ApiResponse;
use App\Utils\FilepondSave;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $size = $request->input('size', 10);

        $data = $request->user()->role === 'admin'
            ? LiveRoom::query()
            : $request->user()->manageable();

        $data = $data
            ->sort($request->string('sorts'))
            ->search($request->string('search'))
            ->paginate($size)->withQueryString();

        return ApiResponse::success($data);
    }

    public function show(LiveRoom $room)
    {
        Gate::authorize('manageLiveRoom', $room);

        $room->load(['groups']);

        return ApiResponse::success($room);
    }

    public function store(CreateRoomRequest $request)
    {
        $room = LiveRoom::create($request->only(['name', 'description']));
        $request->user()->manageable()->attach($room);

        $cover = FilepondSave::save($request->cover, "cover/$room->id");
        $room->update(['cover' => $cover]);

        return ApiResponse::success($room);
    }

    public function update(UpdateRoomRequest $request, LiveRoom $room)
    {
        Gate::authorize('manageLiveRoom', $room);

        $room->update($request->only(['name', 'description']));

        return ApiResponse::success($room);
    }

    public function destroy(LiveRoom $room)
    {
        Gate::authorize('manageLiveRoom', $room);

        return ApiResponse::success();
    }
}
