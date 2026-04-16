<?php

namespace Database\Seeders;

use App\Models\Live\LiveEvent;
use App\Models\Live\LiveMessage;
use App\Models\Live\LiveRoom;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(100)->create();
        LiveRoom::factory(20)->create();
        LiveEvent::factory(200)->create();
        LiveMessage::factory(1000)->create();
        LiveMessage::factory(1000)->create();
        LiveMessage::factory(1000)->create();
        LiveMessage::factory(1000)->create();
        LiveMessage::factory(1000)->create();
        LiveMessage::factory(1000)->create();
        LiveMessage::factory(1000)->create();
        LiveMessage::factory(1000)->create();
    }
}
