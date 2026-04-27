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
        $validated = $request->validate([
            'content' => ['required', 'string'],
        ]);

        $message = LiveMessage::create([
            'room_id' => $event->room_id,
            'event_id' => $event->id,
            'sender_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

        LiveMessageSubmitted::dispatch($message);

        inertia()->flash(['message' => [
            ...$message->toArray(),
            'sender' => $request->user()->toArray()
        ]]);

        return back();
    }
}
