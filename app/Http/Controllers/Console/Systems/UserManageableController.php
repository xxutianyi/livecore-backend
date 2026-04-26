<?php

namespace App\Http\Controllers\Console\Systems;

use App\Http\Controllers\Controller;
use App\Http\Requests\System\UserRoomsRequest;
use App\Models\User;

class UserManageableController extends Controller
{
    public function __invoke(UserRoomsRequest $request, User $user)
    {
        $user->manageable()->sync($request->room_ids);

        return back();
    }
}
