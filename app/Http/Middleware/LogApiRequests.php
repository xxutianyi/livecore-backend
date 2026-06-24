<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class LogApiRequests
{
    public function handle(Request $request, Closure $next): Response
    {
        $startedAt = microtime(true);
        $response = null;
        $exception = null;

        try {
            $response = $next($request);
            return $response;
        } catch (Throwable $throwable) {
            $exception = $throwable;
            throw $throwable;
        } finally {
            $payload = $request->except([
                'password',
                'password_confirmation',
                'client_secret',
                'token',
            ]);

            Log::channel('api')->info('API request', [
                'method' => $request->getMethod(),
                'path' => $request->path(),
                'query' => $request->query(),
                'payload' => $payload,
                'status' => $response?->getStatusCode() ?? 500,
                'duration_ms' => (int) round((microtime(true) - $startedAt) * 1000),
                'ip' => $request->ip(),
                'forwarded_for' => $request->headers->get('x-forwarded-for'),
                'real_ip' => $request->headers->get('x-real-ip'),
                'user_agent' => $request->userAgent(),
                'user_id' => $request->user()?->id,
                'exception' => $exception?->getMessage(),
            ]);
        }
    }
}
