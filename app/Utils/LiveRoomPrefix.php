<?php

namespace App\Utils;

use App\Models\Live\LiveRoom;

class LiveRoomPrefix
{
    public static function generate(): string
    {
        $characters = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // 去掉容易混淆的字符 (0,O,1,I)

        do {
            $code = '';
            for ($i = 0; $i < 4; $i++) {
                $code .= $characters[random_int(0, strlen($characters) - 1)];
            }
        } while (self::exists($code));

        return "WL-ROOM-$code";
    }

    private static function exists(string $inviterCode): bool
    {
        return LiveRoom::where('live_rooms.slug', $inviterCode)->exists();
    }
}
