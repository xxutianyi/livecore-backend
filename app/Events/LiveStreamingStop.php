<?php

namespace App\Events;

use App\Models\Live\LiveEvent;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LiveStreamingStop implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public LiveEvent $event;

    public function __construct(LiveEvent $event)
    {
        $this->event = $event;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PresenceChannel("live.message.{$this->event->id}")
        ];
    }
}
