<?php

namespace App\Http\Controllers\Console\Systems;

use App\Http\Controllers\Controller;
use App\Http\Requests\System\ClientRequest;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $size = $request->input('size', 10);

        $data = Client::latest()
            ->paginate($size)->withQueryString();

        return inertia('console/systems/clients/index', ['data' => $data]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ClientRequest $request)
    {
        $secret = Str::random(32);

        $whitelist = explode(',', $request->whitelist);
        $whitelist = array_filter(array_map('trim', $whitelist));

        $client = Client::create([
            'name' => $request->name,
            'secret' => Hash::make($secret),
            'whitelist' => $whitelist,
        ]);

        return inertia()->flash(['id' => $client->id, 'secret' => $secret])->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        $client->delete();

        return back();
    }
}
