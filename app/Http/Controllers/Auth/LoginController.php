<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function show()
    {
        return inertia('auth/login');
    }

    public function store(LoginRequest $request)
    {
        $request->authenticate();
        $request->session()->regenerate();

        $defaultRoute = route('rooms.index');

        if ($request->user()->role === 'admin' || $request->user()->role === 'director') {
            $defaultRoute = route('broadcast.direction');
        }

        return redirect()->intended($defaultRoute);
    }

    public function destroy(Request $request)
    {
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
