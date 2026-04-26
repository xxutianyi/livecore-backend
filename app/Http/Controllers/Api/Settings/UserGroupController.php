<?php

namespace App\Http\Controllers\Api\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UserGroupRequest;
use App\Models\UserGroup;
use App\Response\ApiResponse;

class UserGroupController extends Controller
{

    public function index()
    {
        return ApiResponse::success(UserGroup::all());
    }

    public function store(UserGroupRequest $request)
    {
        $group = UserGroup::create($request->validated());

        return ApiResponse::success($group);
    }

    public function show(UserGroup $group)
    {
        return ApiResponse::success($group);
    }

    public function update(UserGroupRequest $request, UserGroup $group)
    {
        $group->update($request->validated());

        return ApiResponse::success($group);
    }

    public function destroy(UserGroup $group)
    {
        $group->users()->detach();
        $group->delete();

        return ApiResponse::success();
    }
}
