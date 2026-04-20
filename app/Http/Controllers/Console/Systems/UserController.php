<?php

namespace App\Http\Controllers\Console\Systems;

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
            ->whereNot('role', 'audience')
            ->sort($request->string('sorts'))
            ->search($request->string('search'))
            ->filter($request->only(['role']));

        return inertia('console/systems/users/index', [
            'data' => $query->paginate($size)->withQueryString()
        ]);
    }

    public function show(User $user)
    {
        return inertia('console/systems/users/show', [
            'user' => $user,
            'directable' => $user->directable
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'role' => ['required', 'string', 'in:admin,director'],
            'name' => ['required', 'string', Rule::unique('users')],
            'email' => ['nullable', 'email', Rule::unique('users')],
            'phone' => ['nullable', 'string', Rule::unique('users')],
        ]);

        $user = User::create($validated);

        return back();
    }

    public function update(User $user, Request $request)
    {
        $validated = $request->validate([
            'role' => ['required', 'string', 'in:admin,director'],
            'name' => ['required', 'string', Rule::unique('users')->ignore($user)],
            'email' => ['nullable', 'email', Rule::unique('users')->ignore($user)],
            'phone' => ['nullable', 'string', Rule::unique('users')->ignore($user)],
        ]);

        $user->update($validated);

        return back();
    }

    public function destroy(User $user)
    {
        $user->delete();

        return to_route('admin.settings.users.index');
    }
}
