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
    /**
     * Handle the incoming request.
     */
    public function show(Request $request, ?LiveRoom $room = null, ?LiveEvent $event = null)
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
            default => $event
                ? [$event->started_at, $event->finished_at ?? now()]
                : [now()->subHours(), now()],
        };

        $roomStat = LiveRoomStat::where('room_id', $room->id)
            ->whereBetween('created_at', $range)->get();

        $eventStat = LiveEventStat::where('event_id', $event?->id)
            ->whereBetween('created_at', $range)->get();

        return inertia('console/broadcast/statistics', [
            'room' => $room,
            'event' => $event,
            'events' => $room?->events,
            'room_stats' => $roomStat,
            'event_stats' => $eventStat,
        ]);
    }
}
