<?php

namespace App\Http\Controllers\Watch;

use App\Http\Controllers\Controller;
use App\Models\Live\LiveEvent;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function store(LiveEvent $event, Request $request)
    {
        $message = $event->messages()->create([
            'room_id' => $event->room_id,
            'content' => $request->input('content'),
            'sender_id' => $request->user()->id,
        ]);

        $message->review($request->user(), now());

        inertia()->flash(['message' => [
            ...$message->toArray(),
            'sender' => $request->user()->toArray()
        ]]);

        return back();
    }
}
