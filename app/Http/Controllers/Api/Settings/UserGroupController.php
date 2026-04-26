<?php

namespace App\Http\Controllers\Api\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UserGroupRequest;
use App\Models\UserGroup;
use App\Response\ApiResponse;
use Illuminate\Http\Request;

class UserGroupController extends Controller
{

    public function index(Request $request)
    {
        $data = UserGroup::with('rooms')
            ->canViewBy($request->user())->get();

        return ApiResponse::success($data);
    }

    public function store(UserGroupRequest $request)
    {
        $group = UserGroup::create($request->only(['name']));

        if ($request->has('room_ids')) {
            $group->rooms()->sync($request->room_ids);
        }

        return ApiResponse::success($group);
    }

    public function show(UserGroup $group)
    {
        return ApiResponse::success($group);
    }

    public function update(UserGroupRequest $request, UserGroup $group)
    {
        $group->update($request->only(['name']));

        if ($request->has('room_ids')) {
            $group->rooms()->sync($request->room_ids);
        }

        return ApiResponse::success($group);
    }

    public function destroy(UserGroup $group)
    {
        $group->users()->detach();
        $group->delete();

        return ApiResponse::success();
    }
}
