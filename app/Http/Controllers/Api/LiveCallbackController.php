<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Live\LiveEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class LiveCallbackController extends Controller
{
    public function push(Request $request)
    {
        Log::channel('streaming')->info('Tencent Callback Push', $request->all());

        $validated = $request->validate([
            'stream_id' => ['required'],
            'event_time' => ['required'],
        ]);

        $event = LiveEvent::find($validated['stream_id']);
        $event->update([
            'started_at' => Carbon::createFromTimestamp($validated['event_time']),
            'finished_at' => null,
        ]);

        return response()->json();
    }

    public function stop(Request $request)
    {
        Log::channel('streaming')->info('Tencent Callback Stop', $request->all());

        $validated = $request->validate([
            'stream_id' => ['required'],
            'event_time' => ['required'],
        ]);

        $event = LiveEvent::find($validated['stream_id']);
        $event->update(['finished_at' => Carbon::createFromTimestamp($validated['event_time'])]);

        return response()->json();
    }

    public function record(Request $request)
    {
        Log::channel('streaming')->info('Tencent Callback Record', $request->all());

        $validated = $request->validate([
            'stream_id' => ['required'],
            'video_url' => ['required'],
        ]);

        $event = LiveEvent::find($validated['stream_id']);
        $event->update(['playback_url' => $validated['video_url']]);

        return response()->json();
    }
}
