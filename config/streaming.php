<?php

return [
    'push' => [
        'key' => env('STREAMING_PUSH_KEY'),
        'domain' => env('STREAMING_PUSH_DOMAIN'),
    ],
    'pull' => [
        'key' => env('STREAMING_PULL_KEY'),
        'codec' => env('STREAMING_PULL_CODEC'),
        'domain' => env('STREAMING_PULL_DOMAIN'),
    ],
    'callback' => [
        'key' => env('STREAMING_CALLBACK_KEY'),
    ]
];
