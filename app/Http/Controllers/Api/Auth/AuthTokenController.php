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
        $request->authenticate();
        $ttl = now()->addDays(30);
        $name = $request->input('device_name');
        $token = $request->user()->createToken($name, ['*'], $ttl)->plainTextToken;

        return ApiResponse::success([
            'token' => $token,
            'expires_in' => 60 * 60 * 24 * 30,
        ]);
    }

    public function destroy(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return ApiResponse::success();
    }
}
