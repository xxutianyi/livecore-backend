<?php

namespace App\Http\Controllers\Console\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UserRequest;
use App\Models\Online\UserOnline;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $size = $request->input('size', 10);
        $online = $request->has('online') ? $request->boolean('online') : null;

        $data = User::canViewBy($request->user())
            ->with(['groups'])->audiences()
            ->withExists([
                'onlines as online_status' => fn ($query) => $query->whereNull('leaving_at'),
            ])
            ->addSelect([
                'last_leaving_at' => UserOnline::query()
                    ->select('leaving_at')
                    ->whereColumn('user_id', 'users.id')
                    ->latest('joined_at')
                    ->limit(1),
            ])
            ->sort($request->string('sorts'))
            ->search($request->string('search'))
            ->whereGroup($request->input('groups'))
            ->whereOnline($online)
            ->paginate($size)->withQueryString();

        $data->getCollection()->each(function (User $user) {
            $user->setAppends([]);
            $user->setAttribute('online', (bool) $user->online_status);
            $user->setAttribute('leaving_at', $user->last_leaving_at);
        });

        return inertia('console/settings/users/index', ['data' => $data]);
    }

    public function show(User $user)
    {
        $user->load(['onlines', 'messages']);

        return inertia('console/settings/users/show', ['user' => $user]);
    }

    public function store(UserRequest $request)
    {
        $user = User::create($request->validated());
        $user->update(['invitation_code' => $request->user()->inviter_code]);
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
