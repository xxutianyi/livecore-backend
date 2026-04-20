<?php

namespace App\Http\Controllers\Console\Settings;

use App\Http\Controllers\Controller;
use App\Models\Live\LiveRoom;
use Illuminate\Http\Request;

class RoomGroupController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request,LiveRoom $room)
    {
        $validated = $request->validate([
            'group_ids' => ['required', 'array'],
            'group_ids.*' => ['required', 'uuid', 'exists:user_groups,id'],
        ]);

        $room->groups()->sync($validated['group_ids']);

        return back();
    }
}
