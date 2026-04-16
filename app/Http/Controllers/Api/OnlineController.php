<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserOnline;
use App\Models\UserOnlineHeartbeat;
use Illuminate\Http\Request;

class OnlineController extends Controller
{
    public function joined(Request $request)
    {
        $online= UserOnline::joined($request->user(), now());

        return response()->json($online->id);
    }

    public function heartbeat(Request $request)
    {
        $validated = $request->validate([
            'meta' => ['required', 'array'],
            'online_id' => ['required', 'uuid', 'exists:user_onlines,id']
        ]);

        UserOnlineHeartbeat::create($validated);

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
