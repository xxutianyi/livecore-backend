<?php

namespace Database\Factories\Live;

use App\Models\Live\LiveEvent;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class LiveMessageFactory extends Factory
{
    public function definition(): array
    {
        $event=LiveEvent::inRandomOrder()->first();

        return [
            'content' => $this->faker->paragraph(1),
            'room_id' => $event->room_id,
            'event_id' => $event->id,
            'sender_id' => User::inRandomOrder()->first()->id,
        ];
    }
}
