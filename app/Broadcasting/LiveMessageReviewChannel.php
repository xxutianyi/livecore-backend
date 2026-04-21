<?php

namespace App\Broadcasting;

use App\Models\Live\LiveEvent;
use App\Models\User;

class LiveMessageReviewChannel
{
    /**
     * Create a new channel instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Authenticate the user's access to the channel.
     */
    public function join(User $user, LiveEvent $event): array|bool
    {
        return $user->toArray();
    }
}
