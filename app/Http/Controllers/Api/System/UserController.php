<?php

namespace App\Http\Controllers\Api\System;

use App\Http\Controllers\Controller;
use App\Http\Requests\System\UserRequest;
use App\Models\User;
use App\Response\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class UserController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAdmin');

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
        Gate::authorize('viewAdmin');

        return ApiResponse::success($user);
    }

    public function store(UserRequest $request)
    {
        Gate::authorize('viewAdmin');

        $user = User::create($request->validated());

        return ApiResponse::success($user);
    }

    public function update(UserRequest $request, User $user)
    {
        Gate::authorize('viewAdmin');

        if ($user->is($request->user())) {
            $user->update($request->except(['role']));
        } else {
            $user->update($request->validated());
        }

        return ApiResponse::success($user);
    }

    public function destroy(Request $request, User $user)
    {
        Gate::authorize('viewAdmin');

        if ($user->is($request->user())) {
            return ApiResponse::unAuthorized();
        }

        $user->onlines()->delete();
        $user->messages()->delete();
        $user->manageable()->detach();
        $user->delete();

        return ApiResponse::success();
    }
}
