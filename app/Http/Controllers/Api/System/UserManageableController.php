<?php

namespace App\Http\Controllers\Api\System;

use App\Http\Controllers\Controller;
use App\Http\Requests\System\UserRoomsRequest;
use App\Models\User;
use App\Response\ApiResponse;

class UserManageableController extends Controller
{
    public function __invoke(UserRoomsRequest $request, User $user)
    {
        $user->manageable()->sync($request->room_ids);

        return ApiResponse::success();
    }
}
