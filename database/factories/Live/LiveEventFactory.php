<?php

namespace Database\Factories\Live;

use App\Models\Live\LiveRoom;
use Bluemmb\Faker\PicsumPhotosProvider;
use Illuminate\Database\Eloquent\Factories\Factory;

class LiveEventFactory extends Factory
{
    public function definition(): array
    {
        $this->faker->addProvider(new PicsumPhotosProvider($this->faker));

        return [
            'name' => $this->faker->name(),
            'cover' => $this->faker->imageUrl(width: 1920, height: 1080),
            'description' => $this->faker->paragraph(1),
            'room_id' => LiveRoom::inRandomOrder()->first()->id,
            'playback_url' => 'https://1500009007.vod2.myqcloud.com/6c9c6038vodcq1500009007/2fb02795387702305297108918/w3C7ZwlsPNYA.mp4'
        ];
    }
}
