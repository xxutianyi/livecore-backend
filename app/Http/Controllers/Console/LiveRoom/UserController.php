<?php

namespace App\Http\Controllers\Console\LiveRoom;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserGroup;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $size = $request->input('size', 10);

        $query = User::query()->with(['groups'])
            ->where('role', 'audience')
            ->sort($request->string('sorts'))
            ->search($request->string('search'))
            ->filter($request->only(['invitation_code']))
            ->whereOnline($request->boolean('online'));

        return inertia('console/live-room/user/index', [
            'data' => $query->paginate($size)->withQueryString(),
            'groups' => UserGroup::all(),
        ]);
    }

    public function show(User $user)
    {
        return inertia('console/live-room/user/show', [
            'user' => $user,
            'onlines' => $user->onlines,
            'messages' => $user->messages,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', Rule::unique('users')],
            'email' => ['nullable', 'email', Rule::unique('users')],
            'phone' => ['nullable', 'string', Rule::unique('users')],
            'invitation_code' => ['nullable', 'string', 'exists:users,inviter_code'],
        ]);

        User::create($validated);

        return back();
    }

    public function update(User $user, Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', Rule::unique('users')->ignore($user)],
            'email' => ['nullable', 'email', Rule::unique('users')->ignore($user)],
            'phone' => ['nullable', 'string', Rule::unique('users')->ignore($user)],
            'invitation_code' => ['nullable', 'string', 'exists:users,inviter_code'],
        ]);

        $user->update($validated);

        return back();
    }

    public function destroy(User $user)
    {
        $user->delete();

        return to_route('users.index');
    }
}
