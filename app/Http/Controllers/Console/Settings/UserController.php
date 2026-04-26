<?php

namespace App\Http\Controllers\Console\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $size = $request->input('size', 10);

        $data = User::canViewBy($request->user())
            ->with(['groups'])->audiences()
            ->sort($request->string('sorts'))
            ->search($request->string('search'))
            ->whereGroup($request->input('groups'))
            ->whereOnline($request->boolean('online'))
            ->paginate($size)->withQueryString();

        return inertia('console/settings/users/index', ['data' => $data]);
    }

    public function show(User $user)
    {
        $user->load(['onlines', 'messages']);

        return inertia('console/settings/users/show', ['user' => $user,]);
    }

    public function store(UserRequest $request)
    {
        $user = User::create($request->validated());
        $user->groups()->sync($request->group_ids);

        return back();
    }

    public function update(UserRequest $request, User $user)
    {
        $user->update($request->validated());
        $user->groups()->sync($request->group_ids);

        return back();
    }

    public function destroy(User $user)
    {
        $user->delete();

        return to_route('settings.users.index');
    }
}
