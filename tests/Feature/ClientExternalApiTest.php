<?php

use App\Models\Client;
use App\Models\Live\LiveEvent;
use App\Models\Live\LiveMessage;
use App\Models\Live\LiveRoom;
use App\Models\Online\UserOnline;
use App\Models\User;
use App\Models\UserGroup;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

function clientCredentials(): array
{
    $secret = 'client-secret';
    $client = Client::create([
        'name' => 'External client',
        'secret' => Hash::make($secret),
        'whitelist' => [],
    ]);

    return [
        'client_id' => $client->id,
        'client_secret' => $secret,
    ];
}

function clientUrl(string $path, ?array $credentials = null): string
{
    $query = http_build_query($credentials ?? clientCredentials());

    return $path.(str_contains($path, '?') ? '&' : '?').$query;
}

function clientPayload(array $payload = []): array
{
    return $payload;
}

function serviceActorWithGroups(): array
{
    $actor = User::factory()->create([
        'role' => 'room-admin',
        'account_type' => 'service',
        'email' => null,
        'phone' => null,
    ]);

    $room = LiveRoom::factory()->create();
    $otherRoom = LiveRoom::factory()->create();
    $group = UserGroup::create(['name' => 'Allowed group']);
    $otherGroup = UserGroup::create(['name' => 'Other group']);

    $actor->manageable()->attach($room);
    $room->groups()->attach($group);
    $otherRoom->groups()->attach($otherGroup);

    return [$actor, $room, $group, $otherGroup];
}

test('client actor can list manageable rooms and groups', function () {
    [$actor, $room, $group, $otherGroup] = serviceActorWithGroups();
    $credentials = clientCredentials();

    $this->getJson(clientUrl("/api/client/actors/$actor->id/rooms", $credentials))
        ->assertOk()
        ->assertJsonPath('code', 0)
        ->assertJsonPath('data.0.id', $room->id);

    $this->getJson(clientUrl("/api/client/actors/$actor->id/groups", $credentials))
        ->assertOk()
        ->assertJsonPath('code', 0)
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $group->id)
        ->assertJsonMissing(['id' => $otherGroup->id]);
});

test('client middleware rejects missing malformed and invalid credentials', function () {
    [$actor] = serviceActorWithGroups();

    $this->getJson("/api/client/actors/$actor->id/rooms")
        ->assertOk()
        ->assertJsonPath('code', 4003)
        ->assertJsonStructure(['errors' => ['client_id', 'client_secret']]);

    $this->getJson(clientUrl("/api/client/actors/$actor->id/rooms", [
        'client_id' => 'not-a-uuid',
        'client_secret' => 'client-secret',
    ]))
        ->assertOk()
        ->assertJsonPath('code', 4003)
        ->assertJsonStructure(['errors' => ['client_id']]);

    $credentials = clientCredentials();
    $credentials['client_secret'] = 'wrong-secret';

    $this->getJson(clientUrl("/api/client/actors/$actor->id/rooms", $credentials))
        ->assertOk()
        ->assertJsonPath('code', 4000);
});

test('client rejects non service actors and ordinary admins', function () {
    $credentials = clientCredentials();
    $ordinaryAdmin = User::factory()->create([
        'role' => 'admin',
        'account_type' => 'human',
    ]);
    $humanRoomAdmin = User::factory()->create([
        'role' => 'room-admin',
        'account_type' => 'human',
    ]);
    $serviceAudience = User::factory()->create([
        'role' => 'audience',
        'account_type' => 'service',
    ]);

    foreach ([$ordinaryAdmin, $humanRoomAdmin, $serviceAudience] as $actor) {
        $this->getJson(clientUrl("/api/client/actors/$actor->id/rooms", $credentials))
            ->assertOk()
            ->assertJsonPath('code', 4000);
    }
});

test('client can list all audiences without actor permissions', function () {
    $credentials = clientCredentials();
    $group = UserGroup::create(['name' => 'Synced group']);
    $otherGroup = UserGroup::create(['name' => 'Other synced group']);
    $audience = User::factory()->create([
        'role' => 'audience',
        'name' => 'Synced Audience',
        'phone' => '13800138100',
        'email' => 'synced-audience@example.com',
    ]);
    $audience->groups()->attach([$group->id, $otherGroup->id]);
    $audienceWithoutGroups = User::factory()->create([
        'role' => 'audience',
        'name' => 'Audience Without Groups',
    ]);
    $admin = User::factory()->create(['role' => 'admin']);
    $room = LiveRoom::factory()->create();
    $event = LiveEvent::factory()->create(['room_id' => $room->id]);
    UserOnline::create([
        'living' => true,
        'user_id' => $audience->id,
        'room_id' => $room->id,
        'event_id' => $event->id,
        'joined_at' => now(),
    ]);

    $response = $this->getJson(clientUrl('/api/client/audiences', $credentials))
        ->assertOk()
        ->assertJsonPath('code', 0);

    $audiences = collect($response->json('data'))->keyBy('id');

    expect($audiences->keys()->all())
        ->toContain($audience->id)
        ->toContain($audienceWithoutGroups->id)
        ->not->toContain($admin->id);

    expect($audiences[$audience->id])
        ->toMatchArray([
            'id' => $audience->id,
            'name' => 'Synced Audience',
            'phone' => '13800138100',
            'email' => 'synced-audience@example.com',
        ])
        ->not->toHaveKey('password')
        ->and($audiences[$audience->id]['group_ids'])
        ->toContain($group->id)
        ->toContain($otherGroup->id)
        ->and($audiences[$audience->id]['online'])->toBeTrue()
        ->and($audiences[$audienceWithoutGroups->id]['group_ids'])->toBe([]);

    expect($audiences[$audienceWithoutGroups->id]['online'])->toBeFalse();
});

test('client audience list is cached for one minute and invalidated after an audience change', function () {
    Cache::forget('client-audiences');
    $credentials = clientCredentials();
    $audience = User::factory()->create(['role' => 'audience', 'name' => 'Cached audience']);

    $response = $this->getJson(clientUrl('/api/client/audiences', $credentials))
        ->assertOk();

    expect(collect($response->json('data'))->pluck('id'))->toContain($audience->id);

    expect(Cache::has('client-audiences'))->toBeTrue();

    $newAudience = User::factory()->create(['role' => 'audience', 'name' => 'Not yet cached']);

    $this->getJson(clientUrl('/api/client/audiences', $credentials))
        ->assertOk()
        ->assertJsonMissing(['id' => $newAudience->id]);

    [$actor, , $group] = serviceActorWithGroups();

    $this->postJson(clientUrl("/api/client/actors/$actor->id/audiences/upsert", $credentials), clientPayload([
        'name' => 'Invalidates audience cache',
        'group_ids' => [$group->id],
    ]))->assertOk()
        ->assertJsonPath('code', 0);

    expect(Cache::has('client-audiences'))->toBeFalse();

    $response = $this->getJson(clientUrl('/api/client/audiences', $credentials))
        ->assertOk();

    expect(collect($response->json('data'))->pluck('id'))->toContain($newAudience->id);

    Cache::forget('client-audiences');
});

test('client can filter the audience list by online status', function () {
    Cache::forget('client-audiences:online');
    Cache::forget('client-audiences:offline');
    $credentials = clientCredentials();
    $onlineAudience = User::factory()->create(['role' => 'audience', 'name' => 'Online audience']);
    $offlineAudience = User::factory()->create(['role' => 'audience', 'name' => 'Offline audience']);
    $room = LiveRoom::factory()->create();
    $event = LiveEvent::factory()->create(['room_id' => $room->id]);
    UserOnline::create([
        'living' => true,
        'user_id' => $onlineAudience->id,
        'room_id' => $room->id,
        'event_id' => $event->id,
        'joined_at' => now(),
    ]);

    $onlineResponse = $this->getJson(clientUrl('/api/client/audiences?online=true', $credentials))
        ->assertOk()
        ->assertJsonPath('code', 0);

    expect(collect($onlineResponse->json('data'))->pluck('id'))
        ->toContain($onlineAudience->id)
        ->not->toContain($offlineAudience->id);

    $offlineResponse = $this->getJson(clientUrl('/api/client/audiences?online=false', $credentials))
        ->assertOk()
        ->assertJsonPath('code', 0);

    expect(collect($offlineResponse->json('data'))->pluck('id'))
        ->toContain($offlineAudience->id)
        ->not->toContain($onlineAudience->id);

    Cache::forget('client-audiences:online');
    Cache::forget('client-audiences:offline');
});

test('client can list rooms accessible by audience id', function () {
    $credentials = clientCredentials();
    $group = UserGroup::create(['name' => 'Audience group']);
    $otherGroup = UserGroup::create(['name' => 'Other audience group']);
    $room = LiveRoom::factory()->create(['name' => 'Accessible room']);
    $otherRoom = LiveRoom::factory()->create(['name' => 'Blocked room']);
    $audience = User::factory()->create(['role' => 'audience']);
    $audienceWithoutGroups = User::factory()->create(['role' => 'audience']);

    $room->groups()->attach($group);
    $otherRoom->groups()->attach($otherGroup);
    $audience->groups()->attach($group);

    $this->getJson(clientUrl("/api/client/audiences/$audience->id/rooms", $credentials))
        ->assertOk()
        ->assertJsonPath('code', 0)
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $room->id)
        ->assertJsonPath('data.0.name', 'Accessible room')
        ->assertJsonMissing(['id' => $otherRoom->id]);

    $this->getJson(clientUrl("/api/client/audiences/$audienceWithoutGroups->id/rooms", $credentials))
        ->assertOk()
        ->assertJsonPath('code', 0)
        ->assertJsonCount(0, 'data');
});

test('client audience rooms rejects non audience users', function () {
    $credentials = clientCredentials();
    $admin = User::factory()->create(['role' => 'admin']);

    $this->getJson(clientUrl("/api/client/audiences/$admin->id/rooms", $credentials))
        ->assertOk()
        ->assertJsonPath('code', 4000);
});

test('client can list a user viewing records with their rooms and events', function () {
    $credentials = clientCredentials();
    $user = User::factory()->create(['role' => 'audience']);
    $otherUser = User::factory()->create();
    $room = LiveRoom::factory()->create(['name' => 'Watched room']);
    $event = LiveEvent::factory()->create(['room_id' => $room->id, 'name' => 'Watched event']);
    $olderRecord = UserOnline::create([
        'living' => false,
        'user_id' => $user->id,
        'room_id' => $room->id,
        'event_id' => $event->id,
        'joined_at' => now()->subHour(),
        'leaving_at' => now()->subMinutes(30),
    ]);
    $latestRecord = UserOnline::create([
        'living' => true,
        'user_id' => $user->id,
        'room_id' => $room->id,
        'event_id' => $event->id,
        'joined_at' => now()->subMinutes(10),
    ]);
    UserOnline::create([
        'living' => false,
        'user_id' => $otherUser->id,
        'room_id' => $room->id,
        'event_id' => $event->id,
        'joined_at' => now(),
    ]);

    $this->getJson(clientUrl("/api/client/audiences/$user->id/viewing-records", $credentials))
        ->assertOk()
        ->assertJsonPath('code', 0)
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('data.0.id', $latestRecord->id)
        ->assertJsonPath('data.0.room.id', $room->id)
        ->assertJsonPath('data.0.room.name', 'Watched room')
        ->assertJsonPath('data.0.event.id', $event->id)
        ->assertJsonPath('data.0.event.name', 'Watched event')
        ->assertJsonPath('data.1.id', $olderRecord->id);
});

test('client can list a user comment records with their rooms and events', function () {
    $credentials = clientCredentials();
    $user = User::factory()->create(['role' => 'audience']);
    $otherUser = User::factory()->create();
    $reviewer = User::factory()->create(['name' => 'Comment Reviewer']);
    $room = LiveRoom::factory()->create(['name' => 'Commented room']);
    $event = LiveEvent::factory()->create(['room_id' => $room->id, 'name' => 'Commented event']);
    $olderComment = LiveMessage::create([
        'content' => 'Earlier comment',
        'room_id' => $room->id,
        'event_id' => $event->id,
        'sender_id' => $user->id,
        'created_at' => now()->subHour(),
    ]);
    $latestComment = LiveMessage::create([
        'content' => 'Latest comment',
        'room_id' => $room->id,
        'event_id' => $event->id,
        'sender_id' => $user->id,
        'created_at' => now()->subMinutes(10),
    ]);
    $latestComment->review($reviewer, now()->subMinute());
    LiveMessage::create([
        'content' => 'Someone else comment',
        'room_id' => $room->id,
        'event_id' => $event->id,
        'sender_id' => $otherUser->id,
    ]);

    $this->getJson(clientUrl("/api/client/audiences/$user->id/comment-records", $credentials))
        ->assertOk()
        ->assertJsonPath('code', 0)
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('data.0.id', $latestComment->id)
        ->assertJsonPath('data.0.content', 'Latest comment')
        ->assertJsonPath('data.0.room.id', $room->id)
        ->assertJsonPath('data.0.room.name', 'Commented room')
        ->assertJsonPath('data.0.event.id', $event->id)
        ->assertJsonPath('data.0.event.name', 'Commented event')
        ->assertJsonPath('data.0.review_status', 'reviewed')
        ->assertJsonPath('data.0.reviewed_at', $latestComment->fresh()->reviewed_at?->toJSON())
        ->assertJsonPath('data.0.reviewer.id', $reviewer->id)
        ->assertJsonPath('data.0.reviewer.name', 'Comment Reviewer')
        ->assertJsonPath('data.1.id', $olderComment->id)
        ->assertJsonPath('data.1.review_status', 'pending')
        ->assertJsonPath('data.1.reviewed_at', null)
        ->assertJsonPath('data.1.reviewer', null);
});

test('client records reject non audience users', function () {
    $credentials = clientCredentials();
    $admin = User::factory()->create(['role' => 'admin']);

    $this->getJson(clientUrl("/api/client/audiences/$admin->id/viewing-records", $credentials))
        ->assertOk()
        ->assertJsonPath('code', 4000);

    $this->getJson(clientUrl("/api/client/audiences/$admin->id/comment-records", $credentials))
        ->assertOk()
        ->assertJsonPath('code', 4000);
});

test('client resets an audience password to the fixed password', function () {
    $credentials = clientCredentials();
    $audience = User::factory()->create([
        'role' => 'audience',
        'password' => 'OldPassword!1',
    ]);

    $response = $this->postJson(clientUrl("/api/client/audiences/$audience->id/password/reset", $credentials))
        ->assertOk()
        ->assertJsonPath('code', 0)
        ->assertJsonPath('data.id', $audience->id)
        ->assertJsonPath('data.user_id', $audience->id)
        ->assertJsonPath('data.password', 'Password!@');

    $password = $response->json('data.password');

    expect($password)
        ->toBe('Password!@')
        ->and(Hash::check($password, $audience->fresh()->password))->toBeTrue();
});

test('client reset audience password rejects non audience users', function () {
    $credentials = clientCredentials();
    $admin = User::factory()->create(['role' => 'admin']);
    $oldPassword = $admin->password;

    $this->postJson(clientUrl("/api/client/audiences/$admin->id/password/reset", $credentials))
        ->assertOk()
        ->assertJsonPath('code', 4000);

    expect($admin->fresh()->password)->toBe($oldPassword);
});

test('client can upsert audience and attach only requested groups without exposing existing groups', function () {
    [$actor, , $group, $otherGroup] = serviceActorWithGroups();
    $credentials = clientCredentials();
    $audience = User::factory()->create([
        'role' => 'audience',
        'name' => 'Old Audience',
        'phone' => '13800138001',
    ]);
    $audience->groups()->attach($otherGroup);

    $response = $this->postJson(clientUrl("/api/client/actors/$actor->id/audiences/upsert", $credentials), clientPayload([
        'phone' => '13800138001',
        'name' => 'External Audience',
        'group_ids' => [$group->id],
    ]))
        ->assertOk()
        ->assertJsonPath('code', 0)
        ->assertJsonPath('data.id', $audience->id)
        ->assertJsonPath('data.user_id', $audience->id)
        ->assertJsonPath('data.name', 'External Audience')
        ->assertJsonMissingPath('data.password')
        ->assertJsonMissing(['groups' => []]);

    expect($response->json('data.group_ids'))
        ->toContain($group->id)
        ->toContain($otherGroup->id);

    expect($audience->fresh()->groups()->pluck('user_groups.id')->all())
        ->toContain($group->id)
        ->toContain($otherGroup->id);
});

test('client can upsert audience without phone and email', function () {
    [$actor, , $group] = serviceActorWithGroups();
    $credentials = clientCredentials();

    $response = $this->postJson(clientUrl("/api/client/actors/$actor->id/audiences/upsert", $credentials), clientPayload([
        'name' => 'No Contact Audience',
        'group_ids' => [$group->id],
    ]))
        ->assertOk()
        ->assertJsonPath('code', 0)
        ->assertJsonPath('data.name', 'No Contact Audience')
        ->assertJsonPath('data.phone', null)
        ->assertJsonPath('data.email', null)
        ->assertJsonPath('data.group_ids.0', $group->id);

    $audience = User::where('name', 'No Contact Audience')->first();
    $password = $response->json('data.password');

    expect($audience)
        ->not->toBeNull()
        ->and($audience->phone)->toBeNull()
        ->and($audience->email)->toBeNull()
        ->and($password)->toBe('Password!@')
        ->and(Hash::check($password, $audience->password))->toBeTrue()
        ->and($audience->groups()->pluck('user_groups.id')->all())->toContain($group->id);
});

test('client upsert updates existing audience by unique identity fields', function () {
    [$actor, , $group] = serviceActorWithGroups();
    $credentials = clientCredentials();
    $audience = User::factory()->create([
        'role' => 'audience',
        'name' => 'Old Name',
        'phone' => null,
        'email' => 'old-audience@example.com',
    ]);

    $this->postJson(clientUrl("/api/client/actors/$actor->id/audiences/upsert", $credentials), clientPayload([
        'name' => 'New Name',
        'phone' => '13800138000',
        'email' => 'old-audience@example.com',
        'group_ids' => [$group->id],
    ]))
        ->assertOk()
        ->assertJsonPath('code', 0)
        ->assertJsonPath('data.id', $audience->id)
        ->assertJsonPath('data.name', 'New Name')
        ->assertJsonPath('data.phone', '13800138000')
        ->assertJsonPath('data.email', 'old-audience@example.com')
        ->assertJsonMissingPath('data.password');

    $audience->refresh();

    expect($audience->name)
        ->toBe('New Name')
        ->and($audience->phone)->toBe('13800138000')
        ->and($audience->email)->toBe('old-audience@example.com')
        ->and(User::where('email', 'old-audience@example.com')->count())->toBe(1);
});

test('client upsert rejects unauthorized invalid empty and missing groups', function () {
    [$actor, , , $otherGroup] = serviceActorWithGroups();
    $credentials = clientCredentials();

    $this->postJson(clientUrl("/api/client/actors/$actor->id/audiences/upsert", $credentials), clientPayload([
        'name' => 'Unauthorized Group',
        'group_ids' => [$otherGroup->id],
    ]))
        ->assertOk()
        ->assertJsonPath('code', 4000);

    $this->postJson(clientUrl("/api/client/actors/$actor->id/audiences/upsert", $credentials), clientPayload([
        'name' => 'Empty Groups',
        'group_ids' => [],
    ]))
        ->assertOk()
        ->assertJsonPath('code', 4003)
        ->assertJsonStructure(['errors' => ['group_ids']]);

    $this->postJson(clientUrl("/api/client/actors/$actor->id/audiences/upsert", $credentials), clientPayload([
        'name' => 'Missing Groups',
    ]))
        ->assertOk()
        ->assertJsonPath('code', 4003)
        ->assertJsonStructure(['errors' => ['group_ids']]);

    $this->postJson(clientUrl("/api/client/actors/$actor->id/audiences/upsert", $credentials), clientPayload([
        'name' => 'Invalid Group',
        'group_ids' => ['not-a-uuid'],
    ]))
        ->assertOk()
        ->assertJsonPath('code', 4003)
        ->assertJsonStructure(['errors' => ['group_ids.0']]);

    expect(User::whereIn('name', [
        'Unauthorized Group',
        'Empty Groups',
        'Missing Groups',
        'Invalid Group',
    ])->count())->toBe(0);
});

test('client upsert refuses identity owned by non audience user', function () {
    [$actor, , $group] = serviceActorWithGroups();
    $credentials = clientCredentials();
    $admin = User::factory()->create([
        'role' => 'admin',
        'name' => 'Admin Identity',
    ]);

    $this->postJson(clientUrl("/api/client/actors/$actor->id/audiences/upsert", $credentials), clientPayload([
        'name' => 'Admin Identity',
        'group_ids' => [$group->id],
    ]))
        ->assertOk()
        ->assertJsonPath('code', 4000);

    expect($admin->fresh()->role)->toBe('admin');
});

test('client upsert rejects identity fields matching different users', function () {
    [$actor, , $group] = serviceActorWithGroups();
    $credentials = clientCredentials();
    $audienceByName = User::factory()->create([
        'role' => 'audience',
        'name' => 'Identity Name',
        'email' => 'identity-name@example.com',
    ]);
    $audienceByEmail = User::factory()->create([
        'role' => 'audience',
        'name' => 'Other Identity',
        'email' => 'identity-email@example.com',
    ]);

    $this->postJson(clientUrl("/api/client/actors/$actor->id/audiences/upsert", $credentials), clientPayload([
        'name' => 'Identity Name',
        'email' => 'identity-email@example.com',
        'group_ids' => [$group->id],
    ]))
        ->assertOk()
        ->assertJsonPath('code', 4003)
        ->assertJsonStructure(['errors' => ['identity']]);

    expect($audienceByName->fresh()->email)
        ->toBe('identity-name@example.com')
        ->and($audienceByEmail->fresh()->name)->toBe('Other Identity');
});

test('client cannot attach unauthorized groups', function () {
    [$actor, , , $otherGroup] = serviceActorWithGroups();
    $credentials = clientCredentials();
    $audience = User::factory()->create(['role' => 'audience']);

    $this->postJson(clientUrl("/api/client/actors/$actor->id/audiences/$audience->id/groups/attach", $credentials), clientPayload([
        'group_ids' => [$otherGroup->id],
    ]))
        ->assertOk()
        ->assertJsonPath('code', 4000);

    expect($audience->fresh()->groups()->count())->toBe(0);
});

test('client attach returns complete audience group ids after operation', function () {
    [$actor, , $group] = serviceActorWithGroups();
    $credentials = clientCredentials();
    $otherRoom = LiveRoom::factory()->create();
    $otherAllowedGroup = UserGroup::create(['name' => 'Other allowed group']);
    $actor->manageable()->attach($otherRoom);
    $otherRoom->groups()->attach($otherAllowedGroup);
    $audience = User::factory()->create(['role' => 'audience']);
    $audience->groups()->attach($otherAllowedGroup);

    $response = $this->postJson(clientUrl("/api/client/actors/$actor->id/audiences/$audience->id/groups/attach", $credentials), clientPayload([
        'group_ids' => [$group->id],
    ]))
        ->assertOk()
        ->assertJsonPath('code', 0);

    expect($response->json('data.group_ids'))
        ->toContain($group->id)
        ->toContain($otherAllowedGroup->id);
});

test('client cannot attach or detach non audience users', function () {
    [$actor, , $group] = serviceActorWithGroups();
    $credentials = clientCredentials();
    $roomAdmin = User::factory()->create(['role' => 'room-admin']);

    $this->postJson(clientUrl("/api/client/actors/$actor->id/audiences/$roomAdmin->id/groups/attach", $credentials), clientPayload([
        'group_ids' => [$group->id],
    ]))
        ->assertOk()
        ->assertJsonPath('code', 4000);

    $this->deleteJson(clientUrl("/api/client/actors/$actor->id/audiences/$roomAdmin->id/groups/detach", $credentials), clientPayload([
        'group_ids' => [$group->id],
    ]))
        ->assertOk()
        ->assertJsonPath('code', 4000);

    expect($roomAdmin->fresh()->groups()->count())->toBe(0);
});

test('client detach removes only requested manageable groups', function () {
    [$actor, , $group, $otherGroup] = serviceActorWithGroups();
    $credentials = clientCredentials();
    $audience = User::factory()->create(['role' => 'audience']);
    $audience->groups()->attach([$group->id, $otherGroup->id]);

    $this->deleteJson(clientUrl("/api/client/actors/$actor->id/audiences/$audience->id/groups/detach", $credentials), clientPayload([
        'group_ids' => [$group->id],
    ]))
        ->assertOk()
        ->assertJsonPath('code', 0)
        ->assertJsonPath('data.group_ids.0', $otherGroup->id)
        ->assertJsonMissingPath('data.group_ids.1');

    $groupIds = $audience->fresh()->groups()->pluck('user_groups.id')->all();

    expect($groupIds)
        ->not->toContain($group->id)
        ->toContain($otherGroup->id);
});

test('client detach rejects unauthorized groups without deleting existing memberships', function () {
    [$actor, , $group, $otherGroup] = serviceActorWithGroups();
    $credentials = clientCredentials();
    $audience = User::factory()->create(['role' => 'audience']);
    $audience->groups()->attach([$group->id, $otherGroup->id]);

    $this->deleteJson(clientUrl("/api/client/actors/$actor->id/audiences/$audience->id/groups/detach", $credentials), clientPayload([
        'group_ids' => [$otherGroup->id],
    ]))
        ->assertOk()
        ->assertJsonPath('code', 4000);

    $groupIds = $audience->fresh()->groups()->pluck('user_groups.id')->all();

    expect($groupIds)
        ->toContain($group->id)
        ->toContain($otherGroup->id);
});

test('client attach and detach validate missing target audience and group fields', function () {
    [$actor] = serviceActorWithGroups();
    $credentials = clientCredentials();
    $missingAudienceId = fake()->uuid();

    $this->postJson(clientUrl("/api/client/actors/$actor->id/audiences/$missingAudienceId/groups/attach", $credentials), clientPayload([
        'group_ids' => [],
    ]))
        ->assertOk()
        ->assertJsonPath('code', 4004);

    $audience = User::factory()->create(['role' => 'audience']);

    $this->postJson(clientUrl("/api/client/actors/$actor->id/audiences/$audience->id/groups/attach", $credentials), clientPayload([]))
        ->assertOk()
        ->assertJsonPath('code', 4003)
        ->assertJsonStructure(['errors' => ['group_ids']]);

    $this->deleteJson(clientUrl("/api/client/actors/$actor->id/audiences/$audience->id/groups/detach", $credentials), clientPayload([
        'group_ids' => [],
    ]))
        ->assertOk()
        ->assertJsonPath('code', 4003)
        ->assertJsonStructure(['errors' => ['group_ids']]);
});
