<?php

namespace App\Http\Controllers\Console\LiveRoom;

use App\Http\Controllers\Controller;
use App\Models\User;
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
            'data' => $query->paginate($size)->withQueryString()
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
            'group_ids' => ['nullable', 'array'],
            'group_ids.*' => ['nullable', 'exists:user_groups,id'],
        ]);

        $user = User::create($validated);
        $user->groups()->sync($request->group_ids);

        return back();
    }

    public function update(User $user, Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', Rule::unique('users')->ignore($user)],
            'email' => ['nullable', 'email', Rule::unique('users')->ignore($user)],
            'phone' => ['nullable', 'string', Rule::unique('users')->ignore($user)],
            'invitation_code' => ['nullable', 'string', 'exists:users,inviter_code'],
            'group_ids' => ['nullable', 'array'],
            'group_ids.*' => ['nullable', 'exists:user_groups,id'],
        ]);

        $user->update($validated);
        $user->groups()->sync($request->group_ids);

        return back();
    }

    public function destroy(User $user)
    {
        $user->delete();

        return to_route('users.index');
    }
}
