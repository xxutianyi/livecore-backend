<?php

namespace Database\Factories\Live;

use Bluemmb\Faker\PicsumPhotosProvider;
use Illuminate\Database\Eloquent\Factories\Factory;

class LiveRoomFactory extends Factory
{
    public function definition(): array
    {
        $this->faker->addProvider(new PicsumPhotosProvider($this->faker));

        return [
            'name' => $this->faker->name(),
            'cover' => $this->faker->imageUrl(width: 1920, height: 1080),
        ];
    }
}
