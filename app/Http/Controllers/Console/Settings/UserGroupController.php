<?php

namespace App\Http\Controllers\Console\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UserGroupRequest;
use App\Models\UserGroup;

class UserGroupController extends Controller
{
    public function store(UserGroupRequest $request)
    {
        UserGroup::create($request->validated());

        return back();
    }

    public function update(UserGroupRequest $request, UserGroup $group)
    {
        $group->update($request->validated());

        return back();
    }

    public function destroy(UserGroup $group)
    {
        $group->users()->detach();
        $group->rooms()->detach();
        $group->delete();

        return back();
    }
}
