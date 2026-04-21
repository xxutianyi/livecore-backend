<?php

namespace App\Http\Controllers\Console\Broadcast;

use App\Http\Controllers\Controller;
use App\Models\Live\LiveEvent;
use App\Models\Live\LiveMessage;
use App\Models\Live\LiveRoom;
use App\Utils\FilepondSave;
use App\Utils\TencentLive;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DirectionController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function create(?LiveRoom $room = null)
    {
        return inertia('console/broadcast/direction/create', [
            'room' => $room,
            'events' => $room?->events,
        ]);
    }

    public function show(LiveRoom $room, LiveEvent $event)
    {
        if ($event->expired_at->isPast()) {
            $expire = now()->addHours(4);
            $tencent = new TencentLive($event, $expire);

            $event->update([
                'push_url' => $tencent->generatePushUrl(),
                'pull_url' => $tencent->generatePullUrl(),
                'expired_at' => $expire,
            ]);
        }

        $messages = LiveMessage::where('event_id', $event->id)
            ->latest()->latest('reviewed_at')->get();

        return inertia('console/broadcast/direction/show', [
            'room' => $room,
            'event' => $event,
            'messages' => $messages,
        ]);
    }

    public function store(Request $request, LiveRoom $room)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'cover' => ['nullable', Rule::filepond(['mimetypes:image/*'])],
        ]);

        $event = $room->events()->create([
            'name' => $request->name,
            'description' => $request->description ?? $room->description,
        ]);

        if ($request->filled('cover')) {
            $cover = FilepondSave::save($request->cover, "cover/$room->id/$event->id");
            $event->update(['cover' => $cover]);
        } else {
            $event->update(['cover' => $room->cover]);
        }

        return back();
    }

    public function update(LiveRoom $room, LiveEvent $event)
    {
        if ($event->started_at && !$event->finished_at) {
            abort(403);
        }

        $expire = now()->addHours(4);
        $tencent = new TencentLive($event, $expire);

        $event->update([
            'push_url' => $tencent->generatePushUrl(),
            'pull_url' => $tencent->generatePullUrl(),
            'expired_at' => $expire,
        ]);

        return back();
    }

    public function destroy(LiveRoom $room, LiveEvent $event)
    {
        if ($event->started_at) {
            abort(403);
        }

        $event->messages()->delete();
        $event->delete();

        return back();
    }
}
