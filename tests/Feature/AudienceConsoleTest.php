<?php

use App\Models\Live\LiveEvent;
use App\Models\Live\LiveMessage;
use App\Models\Live\LiveRoom;
use App\Models\Online\UserOnline;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('audience index keeps its default list and filters online status correctly', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $room = LiveRoom::factory()->create();
    $event = LiveEvent::factory()->create(['room_id' => $room->id]);
    $onlineAudience = User::factory()->create(['role' => 'audience', 'name' => 'Online audience']);
    $offlineAudience = User::factory()->create(['role' => 'audience', 'name' => 'Offline audience']);

    UserOnline::create([
        'user_id' => $onlineAudience->id,
        'room_id' => $room->id,
        'event_id' => $event->id,
        'joined_at' => now()->subMinutes(5),
    ]);

    UserOnline::create([
        'user_id' => $offlineAudience->id,
        'room_id' => $room->id,
        'event_id' => $event->id,
        'joined_at' => now()->subHour(),
        'leaving_at' => now()->subMinutes(30),
    ]);

    $response = $this->actingAs($admin)
        ->get(route('settings.users.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('console/settings/users/index')
            ->has('data.data', 2)
        );

    $audiences = collect($response->inertiaProps('data.data'))->keyBy('id');

    expect($audiences[$onlineAudience->id]['online'])
        ->toBeTrue()
        ->and($audiences[$offlineAudience->id]['online'])
        ->toBeFalse()
        ->and($audiences[$offlineAudience->id]['leaving_at'])
        ->not->toBeNull();

    $onlineResponse = $this->actingAs($admin)
        ->get(route('settings.users.index', ['online' => 'true']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('data.data', 1)
            ->where('data.data.0.id', $onlineAudience->id)
            ->where('data.data.0.online', true)
        );

    $offlineResponse = $this->actingAs($admin)
        ->get(route('settings.users.index', ['online' => 'false']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('data.data', 1)
            ->where('data.data.0.id', $offlineAudience->id)
            ->where('data.data.0.online', false)
        );

    expect($onlineResponse->inertiaProps('data.data.0.name'))
        ->toBe('Online audience')
        ->and($offlineResponse->inertiaProps('data.data.0.name'))
        ->toBe('Offline audience');
});

test('audience detail comments include the live room and review time', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $reviewer = User::factory()->create(['role' => 'room-admin']);
    $room = LiveRoom::factory()->create(['name' => 'Morning room']);
    $event = LiveEvent::factory()->create([
        'room_id' => $room->id,
        'name' => 'Opening session',
    ]);
    $audience = User::factory()->create(['role' => 'audience', 'name' => 'Audience member']);
    $reviewedAt = now()->subMinute()->startOfSecond();

    $message = LiveMessage::create([
        'content' => 'Hello from the room',
        'room_id' => $room->id,
        'event_id' => $event->id,
        'sender_id' => $audience->id,
        'reviewer_id' => $reviewer->id,
        'reviewed_at' => $reviewedAt,
    ]);

    $response = $this->actingAs($admin)
        ->get(route('settings.users.show', $audience))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('console/settings/users/show')
            ->has('user.messages', 1)
            ->where('user.messages.0.id', $message->id)
            ->where('user.messages.0.content', 'Hello from the room')
            ->where('user.messages.0.room.id', $room->id)
            ->where('user.messages.0.room.name', 'Morning room')
            ->where('user.messages.0.event.id', $event->id)
            ->where('user.messages.0.event.name', 'Opening session')
        );

    expect($response->inertiaProps('user.messages.0.reviewed_at'))
        ->toBe($message->fresh()->reviewed_at?->toJSON());
});
