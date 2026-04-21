<?php

namespace App\Http\Controllers\Console\Settings;

use App\Http\Controllers\Controller;
use App\Models\Live\LiveRoom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;

class RoomGroupController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, LiveRoom $room)
    {
        Gate::authorize('manageLiveRoom', $room);
        
        $request->validate([
            'group_ids' => ['nullable', 'array'],
            'group_ids.*' => ['required', 'uuid', 'exists:user_groups,id'],
        ]);

        $room->groups()->sync($request->group_ids);

        Cache::forget("room-audiences-$room->id");

        return back();
    }
}
