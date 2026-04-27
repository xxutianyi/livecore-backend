<?php

namespace App\Http\Controllers\Console\Broadcast;

use App\Http\Controllers\Controller;
use App\Models\Live\LiveEvent;
use App\Models\Live\LiveRoom;
use App\Models\Stats\LiveEventStat;
use App\Models\Stats\LiveRoomStat;
use Illuminate\Http\Request;

class StatisticsController extends Controller
{

    public function index(Request $request, LiveRoom $room)
    {
        $request->validate([
            'range' => ['nullable', 'string', 'in:1h,6h,24h,7d,14d,live']
        ]);

        $range = match ($request->range) {
            '1h' => [now()->subHours(), now()],
            '6h' => [now()->subHours(6), now()],
            '24h' => [now()->subHours(24), now()],
            '7d' => [now()->subWeeks(), now()],
            '14d' => [now()->subWeeks(2), now()],
            default => [now()->subHours(), now()]
        };

        $data = LiveRoomStat::where('room_id', $room?->id)
            ->whereBetween('created_at', $range)->get();

        return inertia('console/broadcast/statistics/index', [
            'data' => $data,
            'room' => $room,
            'events' => $room->events,
        ]);
    }

    /**
     * Handle the incoming request.
     */
    public function show(Request $request, LiveRoom $room , LiveEvent $event )
    {
        $request->validate([
            'range' => ['nullable', 'string', 'in:1h,6h,24h,7d,14d,live']
        ]);

        $range = match ($request->range) {
            '1h' => [now()->subHours(), now()],
            '6h' => [now()->subHours(6), now()],
            '24h' => [now()->subHours(24), now()],
            '7d' => [now()->subWeeks(), now()],
            '14d' => [now()->subWeeks(2), now()],
            default => [$event->started_at, $event->finished_at ?? now()],
        };

        $data = LiveEventStat::where('event_id', $event->id)
            ->whereBetween('created_at', $range)->get();

        return inertia('console/broadcast/statistics/show', [
            'data' => $data,
            'room' => $room,
            'event' => $event,
            'events' => $room->events,
        ]);
    }
}
