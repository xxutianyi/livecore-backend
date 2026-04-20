<?php

namespace App\Http\Controllers\Console\Monitor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PulseController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        return inertia('console/monitor/pulse');
    }
}
