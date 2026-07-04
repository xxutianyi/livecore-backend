<?php

use App\Models\Client;
use App\Models\Live\LiveRoom;
use App\Models\User;
use App\Models\UserGroup;
use Illuminate\Foundation\Testing\RefreshDatabase;
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

function clientPayload(array $payload = [], ?array $credentials = null): array
{
    return array_merge($payload, $credentials ?? clientCredentials());
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

test('client can upsert audience and attach only requested groups without exposing existing groups', function () {
    [$actor, , $group, $otherGroup] = serviceActorWithGroups();
    $credentials = clientCredentials();
    $audience = User::factory()->create([
        'role' => 'audience',
        'external_id' => 'ext-001',
    ]);
    $audience->groups()->attach($otherGroup);

    $this->postJson("/api/client/actors/$actor->id/audiences/upsert", clientPayload([
        'external_id' => 'ext-001',
        'name' => 'External Audience',
        'group_ids' => [$group->id],
    ], $credentials))
        ->assertOk()
        ->assertJsonPath('code', 0)
        ->assertJsonPath('data.id', $audience->id)
        ->assertJsonPath('data.group_ids.0', $group->id)
        ->assertJsonMissing(['groups' => []]);

    expect($audience->fresh()->groups()->pluck('user_groups.id')->all())
        ->toContain($group->id)
        ->toContain($otherGroup->id);
});

test('client can upsert audience without phone and email', function () {
    [$actor, , $group] = serviceActorWithGroups();
    $credentials = clientCredentials();

    $this->postJson("/api/client/actors/$actor->id/audiences/upsert", clientPayload([
        'external_id' => 'ext-without-contact',
        'name' => 'No Contact Audience',
        'group_ids' => [$group->id],
    ], $credentials))
        ->assertOk()
        ->assertJsonPath('code', 0)
        ->assertJsonPath('data.external_id', 'ext-without-contact')
        ->assertJsonPath('data.phone', null)
        ->assertJsonPath('data.email', null)
        ->assertJsonPath('data.group_ids.0', $group->id);

    $audience = User::where('external_id', 'ext-without-contact')->first();

    expect($audience)
        ->not->toBeNull()
        ->and($audience->phone)->toBeNull()
        ->and($audience->email)->toBeNull()
        ->and($audience->groups()->pluck('user_groups.id')->all())->toContain($group->id);
});

test('client upsert updates existing audience by external id', function () {
    [$actor, , $group] = serviceActorWithGroups();
    $credentials = clientCredentials();
    $audience = User::factory()->create([
        'role' => 'audience',
        'external_id' => 'ext-update',
        'name' => 'Old Name',
        'phone' => null,
        'email' => null,
    ]);

    $this->postJson("/api/client/actors/$actor->id/audiences/upsert", clientPayload([
        'external_id' => 'ext-update',
        'name' => 'New Name',
        'phone' => '13800138000',
        'email' => 'new-audience@example.com',
        'group_ids' => [$group->id],
    ], $credentials))
        ->assertOk()
        ->assertJsonPath('code', 0)
        ->assertJsonPath('data.id', $audience->id)
        ->assertJsonPath('data.name', 'New Name')
        ->assertJsonPath('data.phone', '13800138000')
        ->assertJsonPath('data.email', 'new-audience@example.com');

    $audience->refresh();

    expect($audience->name)
        ->toBe('New Name')
        ->and($audience->phone)->toBe('13800138000')
        ->and($audience->email)->toBe('new-audience@example.com')
        ->and(User::where('external_id', 'ext-update')->count())->toBe(1);
});

test('client upsert rejects unauthorized invalid empty and missing groups', function () {
    [$actor, , , $otherGroup] = serviceActorWithGroups();
    $credentials = clientCredentials();

    $this->postJson("/api/client/actors/$actor->id/audiences/upsert", clientPayload([
        'external_id' => 'ext-unauthorized-group',
        'name' => 'Unauthorized Group',
        'group_ids' => [$otherGroup->id],
    ], $credentials))
        ->assertOk()
        ->assertJsonPath('code', 4000);

    $this->postJson("/api/client/actors/$actor->id/audiences/upsert", clientPayload([
        'external_id' => 'ext-empty-groups',
        'name' => 'Empty Groups',
        'group_ids' => [],
    ], $credentials))
        ->assertOk()
        ->assertJsonPath('code', 4003)
        ->assertJsonStructure(['errors' => ['group_ids']]);

    $this->postJson("/api/client/actors/$actor->id/audiences/upsert", clientPayload([
        'external_id' => 'ext-missing-groups',
        'name' => 'Missing Groups',
    ], $credentials))
        ->assertOk()
        ->assertJsonPath('code', 4003)
        ->assertJsonStructure(['errors' => ['group_ids']]);

    $this->postJson("/api/client/actors/$actor->id/audiences/upsert", clientPayload([
        'external_id' => 'ext-invalid-group',
        'name' => 'Invalid Group',
        'group_ids' => ['not-a-uuid'],
    ], $credentials))
        ->assertOk()
        ->assertJsonPath('code', 4003)
        ->assertJsonStructure(['errors' => ['group_ids.0']]);

    expect(User::whereIn('external_id', [
        'ext-unauthorized-group',
        'ext-empty-groups',
        'ext-missing-groups',
        'ext-invalid-group',
    ])->count())->toBe(0);
});

test('client upsert refuses external id owned by non audience user', function () {
    [$actor, , $group] = serviceActorWithGroups();
    $credentials = clientCredentials();
    $admin = User::factory()->create([
        'role' => 'admin',
        'external_id' => 'ext-admin',
    ]);

    $this->postJson("/api/client/actors/$actor->id/audiences/upsert", clientPayload([
        'external_id' => 'ext-admin',
        'name' => 'Should Not Update',
        'group_ids' => [$group->id],
    ], $credentials))
        ->assertOk()
        ->assertJsonPath('code', 4000);

    expect($admin->fresh()->name)->not->toBe('Should Not Update');
});

test('client cannot attach unauthorized groups', function () {
    [$actor, , , $otherGroup] = serviceActorWithGroups();
    $credentials = clientCredentials();
    $audience = User::factory()->create(['role' => 'audience']);

    $this->postJson("/api/client/actors/$actor->id/audiences/$audience->id/groups/attach", clientPayload([
        'group_ids' => [$otherGroup->id],
    ], $credentials))
        ->assertOk()
        ->assertJsonPath('code', 4000);

    expect($audience->fresh()->groups()->count())->toBe(0);
});

test('client cannot attach or detach non audience users', function () {
    [$actor, , $group] = serviceActorWithGroups();
    $credentials = clientCredentials();
    $roomAdmin = User::factory()->create(['role' => 'room-admin']);

    $this->postJson("/api/client/actors/$actor->id/audiences/$roomAdmin->id/groups/attach", clientPayload([
        'group_ids' => [$group->id],
    ], $credentials))
        ->assertOk()
        ->assertJsonPath('code', 4000);

    $this->deleteJson("/api/client/actors/$actor->id/audiences/$roomAdmin->id/groups/detach", clientPayload([
        'group_ids' => [$group->id],
    ], $credentials))
        ->assertOk()
        ->assertJsonPath('code', 4000);

    expect($roomAdmin->fresh()->groups()->count())->toBe(0);
});

test('client detach removes only requested manageable groups', function () {
    [$actor, , $group, $otherGroup] = serviceActorWithGroups();
    $credentials = clientCredentials();
    $audience = User::factory()->create(['role' => 'audience']);
    $audience->groups()->attach([$group->id, $otherGroup->id]);

    $this->deleteJson("/api/client/actors/$actor->id/audiences/$audience->id/groups/detach", clientPayload([
        'group_ids' => [$group->id],
    ], $credentials))
        ->assertOk()
        ->assertJsonPath('code', 0)
        ->assertJsonPath('data.group_ids.0', $group->id);

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

    $this->deleteJson("/api/client/actors/$actor->id/audiences/$audience->id/groups/detach", clientPayload([
        'group_ids' => [$otherGroup->id],
    ], $credentials))
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

    $this->postJson("/api/client/actors/$actor->id/audiences/$missingAudienceId/groups/attach", clientPayload([
        'group_ids' => [],
    ], $credentials))
        ->assertOk()
        ->assertJsonPath('code', 4004);

    $audience = User::factory()->create(['role' => 'audience']);

    $this->postJson("/api/client/actors/$actor->id/audiences/$audience->id/groups/attach", clientPayload([], $credentials))
        ->assertOk()
        ->assertJsonPath('code', 4003)
        ->assertJsonStructure(['errors' => ['group_ids']]);

    $this->deleteJson("/api/client/actors/$actor->id/audiences/$audience->id/groups/detach", clientPayload([
        'group_ids' => [],
    ], $credentials))
        ->assertOk()
        ->assertJsonPath('code', 4003)
        ->assertJsonStructure(['errors' => ['group_ids']]);
});
