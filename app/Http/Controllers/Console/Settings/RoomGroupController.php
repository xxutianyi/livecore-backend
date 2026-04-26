<?php

namespace App\Http\Controllers\Console\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\RoomGroupRequest;
use App\Models\Live\LiveRoom;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;

class RoomGroupController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(RoomGroupRequest $request, LiveRoom $room)
    {
        Gate::authorize('manageLiveRoom', $room);

        $room->groups()->sync($request->group_ids);

        Cache::forget("room-audiences-$room->id");

        return back();
    }
}
