<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Online\UserOnline;
use Illuminate\Http\Request;

class UserPresenceController extends Controller
{
    public function joined(Request $request)
    {
        $validated = $request->validate([
            'living' => ['required', 'boolean'],
            'room_id' => ['required', 'uuid', 'exists:live_rooms,id'],
            'event_id' => ['required', 'uuid', 'exists:live_events,id'],
        ]);

        $online = UserOnline::heartbeat([
            'living' => $validated['living'],
            'user_id' => $request->user()->id,
            'room_id' => $validated['room_id'],
            'event_id' => $validated['event_id'],
            'joined_at' => now(),
        ]);

        return response()->json($online->id);
    }

    public function heartbeat(Request $request)
    {
        $validated = $request->validate([
            'living' => ['required', 'boolean'],
            'room_id' => ['required', 'uuid', 'exists:live_rooms,id'],
            'event_id' => ['required', 'uuid', 'exists:live_events,id'],
        ]);

        UserOnline::heartbeat([
            'living' => $validated['living'],
            'user_id' => $request->user()->id,
            'room_id' => $validated['room_id'],
            'event_id' => $validated['event_id'],
            'joined_at' => now(),
        ]);

        return response()->json();
    }

    public function leaving(Request $request)
    {
        $validated = $request->validate([
            'online_id' => ['required', 'uuid', 'exists:user_onlines,id']
        ]);

        UserOnline::find($validated['online_id'])->update(['leaving_at' => now()]);

        return response()->json();
    }
}
