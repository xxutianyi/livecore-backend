<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\TokenRequest;
use App\Response\ApiResponse;
use Illuminate\Http\Request;

class AuthTokenController extends Controller
{
    public function store(TokenRequest $request)
    {
        $sec = 60 * 5;
        $request->authenticate();
        $ttl = now()->addSeconds($sec);
        $name = $request->input('device_name');
        $token = $request->user()->createToken($name, ['*'], $ttl)->plainTextToken;

        return ApiResponse::success([
            'token' => $token,
            'expires_in' => $sec,
            'user' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
            ],
        ]);
    }

    public function destroy(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return ApiResponse::success();
    }
}
