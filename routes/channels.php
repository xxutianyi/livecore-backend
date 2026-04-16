<?php

use App\Broadcasting\LiveMessageChannel;
use App\Broadcasting\LiveMessageReviewChannel;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('live.message.{event}', LiveMessageChannel::class);
Broadcast::channel('live.message.{event}.review', LiveMessageReviewChannel::class);
