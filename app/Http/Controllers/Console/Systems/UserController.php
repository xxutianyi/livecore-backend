<?php

namespace App\Http\Controllers\Console\Systems;

use App\Http\Controllers\Controller;
use App\Http\Requests\System\UserRequest;
use App\Models\User;
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

        return inertia('console/systems/users/index', ['data' => $data]);
    }

    public function show(User $user)
    {
        $user->load(['manageable']);

        return inertia('console/systems/users/show', ['user' => $user]);
    }

    public function store(UserRequest $request)
    {
        User::create($request->validated());

        return back();
    }

    public function update(User $user, UserRequest $request)
    {
        $user->update($request->validated());

        return back();
    }

    public function destroy(User $user)
    {
        $user->delete();

        return to_route('systems.users.index');
    }
}
