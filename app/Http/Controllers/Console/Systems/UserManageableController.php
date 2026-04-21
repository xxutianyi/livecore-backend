<?php

namespace App\Http\Controllers\Console\Systems;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserManageableController extends Controller
{
    public function __invoke(Request $request, User $user)
    {
        $request->validate([
            'room_ids' => ['nullable', 'array'],
            'room_ids.*' => ['required', 'uuid', 'exists:live_rooms,id'],
        ]);

        $user->manageable()->sync($request->room_ids);

        return back();
    }
}
