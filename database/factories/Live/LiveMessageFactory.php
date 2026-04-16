<?php

namespace Database\Factories\Live;

use App\Models\Live\LiveEvent;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class LiveMessageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'content' => $this->faker->paragraph(1),
            'event_id' => LiveEvent::inRandomOrder()->first()->id,
            'sender_id' => User::inRandomOrder()->first()->id,
        ];
    }
}
