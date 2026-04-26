<?php

namespace App\Http\Controllers\Console\Settings;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

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
        return inertia('console/settings/users/show', [
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

        $user = User::create([...$validated, 'password' => Hash::make('Password!@')]);
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

        return to_route('settings.users.index');
    }
}
