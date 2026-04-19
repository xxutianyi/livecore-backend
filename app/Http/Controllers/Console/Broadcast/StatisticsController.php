<?php

namespace App\Http\Controllers\Console\Broadcast;

use App\Http\Controllers\Controller;
use App\Models\Live\LiveRoom;
use Illuminate\Http\Request;

class StatisticsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, ?LiveRoom $room = null)
    {
        return inertia('console/broadcast/statistics', [
            'room' => $room,
        ]);
    }
}
