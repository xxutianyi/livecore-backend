<?php

namespace App\Http\Controllers\Console\LiveRoom;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $size = $request->input('size', 10);

        $query = User::query()
            ->where('role', 'audience')
            ->sort($request->string('sorts'))
            ->search($request->string('search'))
            ->filter($request->only(['invitation_code']))
            ->whereOnline($request->boolean('online'));

        return inertia('console/live-room/user/index', [
            'data' => $query->paginate($size)->withQueryString(),
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
}
