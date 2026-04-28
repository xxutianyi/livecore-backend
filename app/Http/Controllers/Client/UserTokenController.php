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
        $ttl = now()->addHours(2);
        $name = "client:" . $request->client_id;
        $token = $user->createToken($name, [], $ttl)->plainTextToken;

        return ApiResponse::success(['token' => $token, 'expires_in' => 2 * 60 * 60]);
    }
}
