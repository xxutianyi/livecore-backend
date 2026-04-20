<?php

namespace App\Http\Controllers\Console\Broadcast;

use App\Http\Controllers\Controller;
use App\Models\Live\LiveEvent;
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

        return inertia('console/broadcast/direction', [
            'room' => $room,
            'events' => $room?->events,
        ]);
    }

    public function show(LiveRoom $room, LiveEvent $event)
    {
        return inertia('console/broadcast/direction', [
            'room' => $room,
            'event' => $event,
            'events' => $room->events,
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

        return to_route('broadcast.direction.show', [$room, $event]);
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

        return to_route('broadcast.direction', $room);
    }
}
