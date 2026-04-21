<?php

namespace App\Http\Controllers\Watch;

use App\Events\LiveMessageSubmitted;
use App\Http\Controllers\Controller;
use App\Models\Live\LiveEvent;
use App\Models\Live\LiveMessage;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function store(LiveEvent $event, Request $request)
    {
        $message = LiveMessage::create([
            'event_id' => $event->id,
            'room_id' => $event->room_id,
            'content' => $request->input('content'),
            'sender_id' => $request->user()->id,
        ]);

        LiveMessageSubmitted::dispatch($message);

        inertia()->flash(['message' => [
            ...$message->toArray(),
            'sender' => $request->user()->toArray()
        ]]);

        return back();
    }
}
