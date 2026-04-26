<?php

namespace App\Http\Controllers\Console\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UserBatchRequest;
use App\Models\User;

class UserBatchController extends Controller
{
    public function group(UserBatchRequest $request)
    {
        User::whereIn('id', $request->user_ids)
            ->each(function (User $user) use ($request) {
                $user->groups()->sync($request->group_ids);
            });

        return back();
    }
}
