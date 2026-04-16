<?php

namespace App\Utils;

use App\Models\User;
use Illuminate\Support\Str;

class InviterCode
{
    public static function generate(): string
    {
        $characters = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // 去掉容易混淆的字符 (0,O,1,I)

        do {
            $code = '';
            for ($i = 0; $i < 6; $i++) {
                $code .= $characters[random_int(0, strlen($characters) - 1)];
            }
        } while (self::exists($code));

        return "WL-$code";
    }

    private static function exists(string $inviterCode): bool
    {
        return User::where('users.inviter_code', $inviterCode)->exists();
    }
}
