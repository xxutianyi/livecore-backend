<?php

namespace App\Http\Controllers\Console\Broadcast;

use App\Events\LiveMessagePublished;
use App\Http\Controllers\Controller;
use App\Models\Live\LiveEvent;
use App\Models\Live\LiveMessage;
use App\Models\Live\LiveRoom;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function store(Request $request, LiveRoom $room, LiveEvent $event)
    {
        $request->validate([
            'content' => ['required', 'string'],
        ]);

        $message = LiveMessage::create([
            'event_id' => $event->id,
            'room_id' => $event->room_id,
            'content' => $request->input('content'),
            'sender_id' => $request->user()->id,
        ]);

        $message->review($request->user(), now());

        LiveMessagePublished::dispatch($message);

        return back();
    }

    public function review(Request $request, LiveRoom $room, LiveMessage $message)
    {
        $message->review($request->user(), now());

        LiveMessagePublished::dispatch($message);

        return back();
    }
}
