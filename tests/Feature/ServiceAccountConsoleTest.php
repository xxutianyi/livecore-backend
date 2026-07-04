<?php

use App\Models\Live\LiveRoom;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function systemAdmin(): User
{
    return User::factory()->create([
        'role' => 'admin',
        'account_type' => 'human',
    ]);
}

test('admin service account index excludes human admins and non room admin service users', function () {
    $admin = systemAdmin();
    $serviceAccount = User::factory()->create([
        'name' => 'Visible Service Actor',
        'role' => 'room-admin',
        'account_type' => 'service',
    ]);
    $humanRoomAdmin = User::factory()->create([
        'name' => 'Human Room Admin',
        'role' => 'room-admin',
        'account_type' => 'human',
    ]);
    $humanAdmin = User::factory()->create([
        'name' => 'Human Admin',
        'role' => 'admin',
        'account_type' => 'human',
    ]);
    $serviceAudience = User::factory()->create([
        'name' => 'Service Audience',
        'role' => 'audience',
        'account_type' => 'service',
    ]);

    $this->actingAs($admin)
        ->get(route('systems.service-accounts.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('console/systems/service-accounts/index')
            ->has('data.data', 1)
            ->where('data.data.0.id', $serviceAccount->id)
        );

    expect(User::serviceAccounts()->pluck('id')->all())
        ->toContain($serviceAccount->id)
        ->not->toContain($humanRoomAdmin->id)
        ->not->toContain($humanAdmin->id)
        ->not->toContain($serviceAudience->id);
});

test('admin can create update and authorize service account', function () {
    $admin = systemAdmin();
    $room = LiveRoom::factory()->create();

    $this->actingAs($admin)
        ->post(route('systems.service-accounts.store'), [
            'name' => 'External Service Actor',
        ])
        ->assertRedirect();

    $serviceAccount = User::where('name', 'External Service Actor')->firstOrFail();

    expect($serviceAccount->role)
        ->toBe('room-admin')
        ->and($serviceAccount->account_type)->toBe('service')
        ->and($serviceAccount->phone)->toBeNull()
        ->and($serviceAccount->email)->toBeNull();

    $this->actingAs($admin)
        ->put(route('systems.service-accounts.update', $serviceAccount), [
            'name' => 'Renamed Service Actor',
        ])
        ->assertRedirect();

    $this->actingAs($admin)
        ->put(route('systems.service-accounts.manageable', $serviceAccount), [
            'room_ids' => [$room->id],
        ])
        ->assertRedirect();

    $serviceAccount->refresh();

    expect($serviceAccount->name)
        ->toBe('Renamed Service Actor')
        ->and($serviceAccount->manageable()->pluck('live_rooms.id')->all())->toContain($room->id);
});

test('service account create and update validate required and unique names', function () {
    $admin = systemAdmin();
    $serviceAccount = User::factory()->create([
        'name' => 'Existing Service Actor',
        'role' => 'room-admin',
        'account_type' => 'service',
    ]);

    $this->actingAs($admin)
        ->from(route('systems.service-accounts.index'))
        ->post(route('systems.service-accounts.store'), [
            'name' => '',
        ])
        ->assertRedirect(route('systems.service-accounts.index'))
        ->assertSessionHasErrors('name');

    $this->actingAs($admin)
        ->from(route('systems.service-accounts.index'))
        ->post(route('systems.service-accounts.store'), [
            'name' => 'Existing Service Actor',
        ])
        ->assertRedirect(route('systems.service-accounts.index'))
        ->assertSessionHasErrors('name');

    $this->actingAs($admin)
        ->from(route('systems.service-accounts.show', $serviceAccount))
        ->put(route('systems.service-accounts.update', $serviceAccount), [
            'name' => 'Existing Service Actor',
        ])
        ->assertRedirect(route('systems.service-accounts.show', $serviceAccount))
        ->assertSessionDoesntHaveErrors();

    $otherServiceAccount = User::factory()->create([
        'name' => 'Other Service Actor',
        'role' => 'room-admin',
        'account_type' => 'service',
    ]);

    $this->actingAs($admin)
        ->from(route('systems.service-accounts.show', $serviceAccount))
        ->put(route('systems.service-accounts.update', $serviceAccount), [
            'name' => 'Other Service Actor',
        ])
        ->assertRedirect(route('systems.service-accounts.show', $serviceAccount))
        ->assertSessionHasErrors('name');

    expect($serviceAccount->fresh()->name)
        ->toBe('Existing Service Actor')
        ->and($otherServiceAccount->fresh()->name)->toBe('Other Service Actor');
});

test('service account routes do not operate on human admins', function () {
    $admin = systemAdmin();
    $humanRoomAdmin = User::factory()->create([
        'name' => 'Human Room Admin',
        'role' => 'room-admin',
        'account_type' => 'human',
    ]);

    $this->actingAs($admin)
        ->get(route('systems.service-accounts.show', $humanRoomAdmin))
        ->assertNotFound();

    $this->actingAs($admin)
        ->put(route('systems.service-accounts.update', $humanRoomAdmin), [
            'name' => 'Renamed Human Room Admin',
        ])
        ->assertNotFound();

    $this->actingAs($admin)
        ->delete(route('systems.service-accounts.destroy', $humanRoomAdmin))
        ->assertNotFound();

    $this->assertDatabaseHas('users', [
        'id' => $humanRoomAdmin->id,
        'name' => 'Human Room Admin',
        'account_type' => 'human',
    ]);
});

test('admin can delete service account without affecting human admins', function () {
    $admin = systemAdmin();
    $serviceAccount = User::factory()->create([
        'name' => 'Disposable Service Actor',
        'role' => 'room-admin',
        'account_type' => 'service',
    ]);

    $this->actingAs($admin)
        ->delete(route('systems.service-accounts.destroy', $serviceAccount))
        ->assertRedirect(route('systems.service-accounts.index'));

    $this->assertDatabaseMissing('users', [
        'id' => $serviceAccount->id,
    ]);

    $this->assertDatabaseHas('users', [
        'id' => $admin->id,
        'account_type' => 'human',
    ]);
});

test('only system admins can manage service account room authorization routes', function () {
    $roomAdmin = User::factory()->create([
        'role' => 'room-admin',
        'account_type' => 'human',
    ]);
    $serviceAccount = User::factory()->create([
        'name' => 'Restricted Service Actor',
        'role' => 'room-admin',
        'account_type' => 'service',
    ]);
    $room = LiveRoom::factory()->create();

    $this->actingAs($roomAdmin)
        ->put(route('systems.service-accounts.manageable', $serviceAccount), [
            'room_ids' => [$room->id],
        ])
        ->assertForbidden();

    expect($serviceAccount->fresh()->manageable()->count())->toBe(0);
});
