<?php

namespace App\Http\Controllers\Api\Watch;

use App\Events\LiveMessageSubmitted;
use App\Http\Controllers\Controller;
use App\Models\Live\LiveEvent;
use App\Models\Live\LiveMessage;
use App\Response\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class MessageController extends Controller
{
    public function index( LiveEvent $event)
    {
        Gate::authorize('viewLiveRoom', $event->room);

        return ApiResponse::success($event->messages);
    }

    public function store( LiveEvent $event, Request $request)
    {
        Gate::authorize('viewLiveRoom', $event->room);

        $request->validate([
            'content' => ['required', 'string'],
        ]);
        
        $message = LiveMessage::create([
            'room_id' => $event->room->id,
            'event_id' => $event->id,
            'content' => $request->input('content'),
            'sender_id' => $request->user()->id,
        ]);

        LiveMessageSubmitted::dispatch($message);

        return ApiResponse::success([
            ...$message->toArray(),
            'sender' => $request->user()->toArray()
        ]);
    }
}
