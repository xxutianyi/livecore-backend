<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class BroadcastMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $room = $request->route('room');
        $cacheKey = "broadcast-room-{$request->user()->id}";

        if ($room) {
            Cache::put($cacheKey, $room->id);
        }

        if (!$room && Cache::has($cacheKey)) {
            return redirect($request->url() . '/' . Cache::get($cacheKey));
        }

        return $next($request);
    }
}
