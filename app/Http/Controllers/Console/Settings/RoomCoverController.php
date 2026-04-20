<?php

namespace App\Http\Controllers\Console\Settings;

use App\Http\Controllers\Controller;
use App\Models\Live\LiveRoom;
use App\Utils\FilepondSave;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RoomCoverController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, LiveRoom $room)
    {
        $request->validate([
            'file' => ['required', Rule::filepond(['mimetypes:image/*'])],
        ]);

        $room->update(['cover' => FilepondSave::save($request->file, "cover/$room->id")]);

        return back();
    }
}
