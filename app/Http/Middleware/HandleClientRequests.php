<?php

namespace App\Http\Middleware;

use App\Models\Client;
use App\Response\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class HandleClientRequests
{
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $request->validate([
            'client_id' => ['required', 'uuid'],
            'client_secret' => ['required', 'string'],
        ]);

        $client = Client::find($request->client_id);
        $secret = Hash::check($request->client_secret, $client?->secret);
        $whitelist = $client->whitelist->isEmpty() ?? $client?->whitelist->contains($request->ip());

        if (!$secret || !$whitelist) {
            return ApiResponse::unAuthorized();
        }

        return $next($request);
    }
}
