<?php

namespace App\Http\Controllers\Console\LiveRoom;

use App\Http\Controllers\Controller;
use App\Models\UserGroup;
use Illuminate\Http\Request;

class UserBatchController extends Controller
{
    public function group(Request $request)
    {
        $validated = $request->validate([
            'user_ids' => ['required', 'array'],
            'user_ids.*' => ['required', 'uuid', 'exists:users,id'],
            'group_id' => ['required', 'exists:user_groups,id'],
        ]);

        UserGroup::find($validated['group_id'])->users()->attach($validated['user_ids']);

        return back();
    }
}
