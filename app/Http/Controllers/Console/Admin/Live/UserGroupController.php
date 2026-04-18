<?php

namespace App\Http\Controllers\Console\Admin\Live;

use App\Http\Controllers\Controller;
use App\Models\UserGroup;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserGroupController extends Controller
{
    public function index(Request $request)
    {
        $size = $request->input('size', 10);

        $query = UserGroup::query()
            ->sort($request->string('sorts'))
            ->search($request->string('search'));

        return inertia('console/admin/live/groups/index', [
            'data' => $query->paginate($size)->withQueryString(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', Rule::unique('user_groups')],
        ]);

        UserGroup::create($validated);

        return back();
    }

    public function update(Request $request, UserGroup $group)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', Rule::unique('user_groups')->ignore($group)],
        ]);

        $group->update($validated);

        return back();
    }

    public function destroy(UserGroup $group){

    }
}
