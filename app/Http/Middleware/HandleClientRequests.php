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
    protected function resolveClientIp(Request $request): ?string
    {
        $candidates = [
            $request->ip(),
            $request->headers->get('cf-connecting-ip'),
            $request->headers->get('x-forwarded-for'),
            $request->headers->get('x-real-ip'),
        ];

        foreach ($candidates as $candidate) {
            if (! $candidate) {
                continue;
            }

            $ip = trim(explode(',', $candidate)[0]);

            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }

        return null;
    }

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $request->validate([
            'client_id' => ['required', 'uuid'],
            'client_secret' => ['required', 'string'],
        ]);

        $client = Client::find($request->client_id);
        $secret = Hash::check($request->client_secret, $client?->secret);
        $clientIp = $this->resolveClientIp($request);
        $whitelist = $client?->whitelist->isEmpty() ?? false;

        if (! $whitelist && $clientIp) {
            $whitelist = $client?->whitelist->contains($clientIp) ?? false;
        }

        if (! $secret || ! $whitelist) {
            return ApiResponse::unAuthorized();
        }

        return $next($request);
    }
}
