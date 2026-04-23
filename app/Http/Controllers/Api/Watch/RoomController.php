<?php

namespace App\Http\Controllers\Api\Watch;

use App\Http\Controllers\Controller;
use App\Models\Live\LiveRoom;
use App\Response\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $data = LiveRoom::all()->reject(
            function (LiveRoom $room) use ($request) {
                return Gate::denies('viewLiveRoom', $room);
            })->flatten();

        return ApiResponse::success($data);
    }

    public function show(LiveRoom $room)
    {
        Gate::authorize('viewLiveRoom', $room);

        return ApiResponse::success($room);
    }
}
