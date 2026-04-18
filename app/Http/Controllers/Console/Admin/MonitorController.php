<?php

namespace App\Http\Controllers\Console\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MonitorController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        return inertia('console/admin/monitor/show');
    }
}
