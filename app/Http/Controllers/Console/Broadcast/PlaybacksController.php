<?php

namespace App\Http\Controllers\Console\Broadcast;

use App\Http\Controllers\Controller;
use App\Models\Live\LiveEvent;
use App\Models\Live\LiveRoom;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use RahulHaque\Filepond\Facades\Filepond;

class PlaybacksController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function index(Request $request, ?LiveRoom $room = null)
    {
        $size = $request->input('size', 10);

        $events = $room?->events()
            ->sort($request->string('sorts'))
            ->search($request->string('search'))
            ->paginate($size)->withQueryString();

        return inertia('console/broadcast/playbacks', [
            'room' => $room,
            'events' => $events,
        ]);
    }

    public function update(Request $request, LiveRoom $room, LiveEvent $event)
    {
        $validated = $request->validate([
            'published' => ['required', 'boolean'],
        ]);

        $event->update($validated);

        return back();
    }

    public function upload(Request $request, LiveRoom $room, LiveEvent $event)
    {
        $request->validate([
            'file' => ['required', Rule::filepond(['mimetypes:video/mp4'])],
        ]);

        $fileInfo = Filepond::field($request->file)->moveTo("playback/$room->id/$event->id");

        $event->update(['playback_url' => $fileInfo['url']]);

        return back();
    }
}
