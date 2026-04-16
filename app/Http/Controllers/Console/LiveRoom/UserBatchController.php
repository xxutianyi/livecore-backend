<?php

namespace App\Http\Controllers\Console\LiveRoom;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserBatchController extends Controller
{
    public function group(Request $request)
    {
        $validated = $request->validate([
            'user_ids' => ['required', 'array'],
            'user_ids.*' => ['required', 'uuid', 'exists:users,id'],
            'group_ids' => ['required', 'array'],
            'group_ids.*' => ['required', 'exists:user_groups,id'],
        ]);

        User::whereIn('id', $validated['user_ids'])
            ->each(function (User $user) use ($validated) {
                $user->groups()->sync($validated['group_ids']);
            });

        return back();
    }
}
