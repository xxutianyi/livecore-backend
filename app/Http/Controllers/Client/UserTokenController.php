<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Response\ApiResponse;
use Illuminate\Http\Request;

class UserTokenController extends Controller
{
    public function __invoke(Request $request, User $user)
    {
        $sec = 60 * 5;
        $ttl = now()->addSeconds($sec);
        $name = "client:" . $request->client_id;
        $token = $user->createToken($name, [], $ttl)->plainTextToken;

        return ApiResponse::success([
            'token' => $token,
            'expires_in' => $sec,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
        ]);
    }
}
