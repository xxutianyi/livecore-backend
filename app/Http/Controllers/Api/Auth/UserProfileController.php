<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\PasswordRequest;
use App\Http\Requests\Auth\ProfileRequest;
use App\Response\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserProfileController extends Controller
{
    public function show(Request $request)
    {
        return ApiResponse::success($request->user());
    }

    public function update(ProfileRequest $request)
    {
        $request->user()->update($request->validated());

        return ApiResponse::success($request->user());
    }

    public function password(PasswordRequest $request)
    {
        $request->user()->update([
            'password' => Hash::make($request->password)
        ]);

        return ApiResponse::success();
    }
}
