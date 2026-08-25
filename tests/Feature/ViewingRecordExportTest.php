<?php

use App\Models\Live\LiveEvent;
use App\Models\Live\LiveRoom;
use App\Models\Online\UserOnline;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('room admins can export an event viewing records as a csv file', function () {
    $roomAdmin = User::factory()->create(['role' => 'room-admin']);
    $viewer = User::factory()->create(['name' => '导出观众']);
    $playbackViewer = User::factory()->create(['name' => '回放观众']);
    $room = LiveRoom::factory()->create(['name' => '导出直播间']);
    $roomAdmin->manageable()->attach($room);
    $event = LiveEvent::factory()->create(['room_id' => $room->id, 'name' => '导出场次']);
    $otherEvent = LiveEvent::factory()->create(['room_id' => $room->id]);
    $joinedAt = CarbonImmutable::create(2026, 8, 25, 0, 0, 0, 'UTC');
    $leavingAt = CarbonImmutable::create(2026, 8, 25, 2, 0, 0, 'UTC');

    UserOnline::create([
        'living' => true,
        'user_id' => $viewer->id,
        'room_id' => $room->id,
        'event_id' => $event->id,
        'joined_at' => $joinedAt,
        'leaving_at' => $leavingAt,
    ]);
    UserOnline::create([
        'living' => false,
        'user_id' => $playbackViewer->id,
        'room_id' => $room->id,
        'event_id' => $event->id,
        'joined_at' => now()->subMinutes(20),
    ]);
    UserOnline::create([
        'living' => false,
        'user_id' => $viewer->id,
        'room_id' => $room->id,
        'event_id' => $otherEvent->id,
        'joined_at' => now(),
    ]);

    $response = $this->actingAs($roomAdmin)
        ->get(route('broadcast.statistics.export', [$room, $event]));

    $response->assertOk()
        ->assertDownload("viewing-records-$event->id.csv")
        ->assertHeader('content-type', 'text/csv; charset=UTF-8');

    expect($response->streamedContent())
        ->toContain('直播间名称,场次名称,用户名称,观看开始时间,观看结束时间,直播/回放')
        ->toContain('导出直播间,导出场次,导出观众')
        ->toContain('2026-08-25 08:00:00')
        ->toContain('2026-08-25 10:00:00')
        ->toContain('直播')
        ->toContain('回放')
        ->not->toContain($otherEvent->name);
});

test('room admins can export viewing records from every event in a room', function () {
    $roomAdmin = User::factory()->create(['role' => 'room-admin']);
    $viewer = User::factory()->create(['name' => '全部场次观众']);
    $room = LiveRoom::factory()->create(['name' => '全部场次直播间']);
    $roomAdmin->manageable()->attach($room);
    $firstEvent = LiveEvent::factory()->create(['room_id' => $room->id, 'name' => '第一场次']);
    $secondEvent = LiveEvent::factory()->create(['room_id' => $room->id, 'name' => '第二场次']);

    foreach ([$firstEvent, $secondEvent] as $event) {
        UserOnline::create([
            'living' => true,
            'user_id' => $viewer->id,
            'room_id' => $room->id,
            'event_id' => $event->id,
            'joined_at' => now(),
        ]);
    }

    $response = $this->actingAs($roomAdmin)
        ->get(route('broadcast.statistics.export-room', $room));

    $response->assertOk()
        ->assertDownload("viewing-records-$room->id.csv");

    expect($response->streamedContent())
        ->toContain('全部场次直播间,第一场次,全部场次观众')
        ->toContain('全部场次直播间,第二场次,全部场次观众');
});

test('room admins cannot export records from an unmanaged room', function () {
    $roomAdmin = User::factory()->create(['role' => 'room-admin']);
    $room = LiveRoom::factory()->create();
    $event = LiveEvent::factory()->create(['room_id' => $room->id]);

    $this->actingAs($roomAdmin)
        ->get(route('broadcast.statistics.export', [$room, $event]))
        ->assertForbidden();
});
