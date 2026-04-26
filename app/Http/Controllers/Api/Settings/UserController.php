<?php

namespace App\Http\Controllers\Api\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UserRequest;
use App\Models\User;
use App\Response\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $size = $request->input('size', 10);

        $data = User::query()
            ->with(['groups'])->audiences()
            ->sort($request->string('sorts'))
            ->search($request->string('search'))
            ->whereGroup($request->input('groups'))
            ->whereOnline($request->boolean('online'))
            ->paginate($size)->withQueryString();

        return ApiResponse::success($data);
    }

    public function show(User $user)
    {
        $user->load(['onlines', 'messages']);

        return ApiResponse::success($user);
    }

    public function store(UserRequest $request)
    {
        $user = User::create([
            ...$request->validated(),
            'password' => Hash::make('Password!@')
        ]);

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
