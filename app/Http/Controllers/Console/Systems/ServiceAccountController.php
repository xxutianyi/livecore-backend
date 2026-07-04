<?php

namespace App\Http\Controllers\Console\Systems;

use App\Http\Controllers\Controller;
use App\Http\Requests\System\ServiceAccountRequest;
use App\Models\User;
use Illuminate\Http\Request;

class ServiceAccountController extends Controller
{
    public function index(Request $request)
    {
        $size = $request->input('size', 10);

        $data = User::query()
            ->serviceAccounts()
            ->with(['manageable'])
            ->sort($request->string('sorts'))
            ->search($request->string('search'))
            ->paginate($size)
            ->withQueryString();

        return inertia('console/systems/service-accounts/index', ['data' => $data]);
    }

    public function show(User $serviceAccount)
    {
        abort_unless($serviceAccount->account_type === 'service', 404);

        $serviceAccount->load(['manageable']);

        return inertia('console/systems/service-accounts/show', ['user' => $serviceAccount]);
    }

    public function store(ServiceAccountRequest $request)
    {
        User::create([
            'name' => $request->validated('name'),
            'role' => 'room-admin',
            'account_type' => 'service',
        ]);

        return back();
    }

    public function update(ServiceAccountRequest $request, User $serviceAccount)
    {
        abort_unless($serviceAccount->account_type === 'service', 404);

        $serviceAccount->update($request->validated());

        return back();
    }

    public function destroy(User $serviceAccount)
    {
        abort_unless($serviceAccount->account_type === 'service', 404);

        $serviceAccount->manageable()->detach();
        $serviceAccount->delete();

        return to_route('systems.service-accounts.index');
    }
}
