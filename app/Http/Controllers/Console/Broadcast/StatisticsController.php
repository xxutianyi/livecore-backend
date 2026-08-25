<?php

namespace App\Http\Controllers\Console\Broadcast;

use App\Http\Controllers\Controller;
use App\Models\Live\LiveEvent;
use App\Models\Live\LiveRoom;
use App\Models\Online\UserOnline;
use App\Models\Stats\LiveEventStat;
use App\Models\Stats\LiveRoomStat;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StatisticsController extends Controller
{
    public function index(Request $request, LiveRoom $room)
    {
        $request->validate([
            'range' => ['nullable', 'string', 'in:1h,6h,24h,7d,14d,live'],
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
    public function show(Request $request, LiveRoom $room, LiveEvent $event)
    {
        $request->validate([
            'range' => ['nullable', 'string', 'in:1h,6h,24h,7d,14d,live'],
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

    public function exportRoom(LiveRoom $room): StreamedResponse
    {
        Gate::authorize('manageLiveRoom', $room);

        return $this->downloadViewingRecords(
            $room,
            UserOnline::query()->where('room_id', $room->id),
            "viewing-records-{$room->id}.csv",
        );
    }

    public function export(LiveRoom $room, LiveEvent $event): StreamedResponse
    {
        Gate::authorize('manageLiveRoom', $room);
        abort_unless($event->room_id === $room->id, 404);

        return $this->downloadViewingRecords(
            $room,
            UserOnline::query()->where('event_id', $event->id),
            "viewing-records-{$event->id}.csv",
        );
    }

    private function downloadViewingRecords(LiveRoom $room, Builder $records, string $filename): StreamedResponse
    {
        return response()->streamDownload(function () use ($room, $records) {
            $stream = fopen('php://output', 'w');
            fwrite($stream, "\xEF\xBB\xBF");
            fputcsv($stream, ['直播间名称', '场次名称', '用户名称', '观看开始时间', '观看结束时间', '直播/回放']);

            $records
                ->with(['user:id,name', 'event:id,name'])
                ->orderBy('joined_at')
                ->orderBy('id')
                ->chunk(500, function ($onlines) use ($stream, $room) {
                    foreach ($onlines as $online) {
                        fputcsv($stream, [
                            $room->name,
                            $online->event->name,
                            $online->user->name,
                            $online->joined_at?->format('Y-m-d H:i:s'),
                            $online->leaving_at?->format('Y-m-d H:i:s'),
                            $online->living ? '直播' : '回放',
                        ]);
                    }
                });

            fclose($stream);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
