<?php

namespace App\Utils;

use App\Models\Live\LiveEvent;
use Carbon\CarbonInterface;

class TencentLive
{
    private string $stream;
    private string $expiredAt;


    public function __construct(LiveEvent $event, CarbonInterface $expiredAt)
    {
        $this->stream = $event->id;
        $this->expiredAt = $expiredAt->toDateTimeString();
    }

    public function generatePushUrl(): string
    {
        $key = config('streaming.push.key');
        $domain = config('streaming.push.domain');

        return "rtmp://$domain/live/$this->stream{$this->generateSignature($key)}";
    }

    public function generatePullUrl(): string
    {
        $key = config('streaming.pull.key');
        $codec = config('streaming.pull.codec');
        $domain = config('streaming.pull.domain');

        return "https://$domain/live/{$this->stream}_$codec.m3u8{$this->generateSignature($key,"_$codec")}";
    }

    private function generateSignature(string $key, string $codec = ""): string
    {
        $txTime = strtoupper(base_convert(strtotime($this->expiredAt), 10, 16));
        $txSecret = md5("$key$this->stream$codec$txTime");

        return "?" . http_build_query(['txTime' => $txTime, 'txSecret' => $txSecret]);
    }
}
