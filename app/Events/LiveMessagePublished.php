<?php

namespace App\Events;

use App\Models\Live\LiveMessage;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LiveMessagePublished implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public LiveMessage $message;

    public function __construct(LiveMessage $message)
    {
        $this->message = $message;
    }

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel("live.message.{$this->message->event_id}"),
            new PresenceChannel("live.message.{$this->message->event_id}.review")
        ];
    }
}
