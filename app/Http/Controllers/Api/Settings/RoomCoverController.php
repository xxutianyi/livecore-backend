<?php

namespace App\Http\Controllers\Api\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Live\UpdateCoverRequest;
use App\Models\Live\LiveRoom;
use App\Response\ApiResponse;
use App\Utils\FilepondSave;
use Illuminate\Support\Facades\Gate;

class RoomCoverController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(UpdateCoverRequest $request, LiveRoom $room)
    {
        Gate::authorize('manageLiveRoom', $room);

        $noCacheQuery="?update=".now()->timestamp;

        $room->update([
            'cover' => FilepondSave::save($request->cover, "cover/$room->id").$noCacheQuery
        ]);

        return ApiResponse::success();
    }
}
