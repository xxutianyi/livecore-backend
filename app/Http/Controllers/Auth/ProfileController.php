<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\PasswordRequest;
use App\Http\Requests\Auth\ProfileRequest;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function show()
    {
        return inertia('website/profile/show');
    }

    public function update(ProfileRequest $request)
    {
        $request->user()->update($request->validated());

        return back();
    }


    public function password(PasswordRequest $request)
    {
        $request->user()->update([
            'password' => Hash::make($request->password)
        ]);

        return back();
    }
}
