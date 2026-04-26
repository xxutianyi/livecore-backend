<?php

namespace App\Http\Controllers\Api\System;

use App\Http\Controllers\Controller;
use App\Http\Requests\System\UserRequest;
use App\Models\User;
use App\Response\ApiResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $size = $request->input('size', 10);

        $data = User::query()->admins()
            ->sort($request->string('sorts'))
            ->search($request->string('search'))
            ->filter($request->only(['role']))
            ->paginate($size)->withQueryString();

        return ApiResponse::success($data);
    }

    public function show(User $user)
    {
        return ApiResponse::success($user);
    }

    public function store(UserRequest $request)
    {
        $user = User::create($request->validated());

        return ApiResponse::success($user);
    }

    public function update(UserRequest $request, User $user)
    {
        $user->update($request->validated());

        return ApiResponse::success($user);
    }

    public function destroy(User $user)
    {
        $user->delete();

        return ApiResponse::success();
    }
}
