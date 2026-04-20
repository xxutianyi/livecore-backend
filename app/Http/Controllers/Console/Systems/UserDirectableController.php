<?php

namespace App\Http\Controllers\Console\Systems;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserDirectableController extends Controller
{
    public function __invoke(Request $request, User $user)
    {
        $validated = $request->validate([
            'room_ids' => ['required', 'array'],
            'room_ids.*' => ['required', 'uuid', 'exists:live_rooms,id'],
        ]);

        $user->directable()->sync($validated['room_ids']);

        return back();
    }
}
