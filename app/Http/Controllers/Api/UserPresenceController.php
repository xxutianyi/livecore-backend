<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Online\UserOnline;
use App\Models\Online\UserOnlineHeartbeat;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;

class UserPresenceController extends Controller
{
    #[Middleware('auth:sanctum')]
    public function joined(Request $request)
    {
        $online = UserOnline::joined($request->user(), now());

        return response()->json($online->id);
    }

    #[Middleware('auth:sanctum')]
    public function heartbeat(Request $request)
    {
        $validated = $request->validate([
            'meta' => ['required', 'array'],
            'online_id' => ['required', 'uuid', 'exists:user_onlines,id']
        ]);

        UserOnline::find($validated['online_id'])->update(['leaving_at' => null]);
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
