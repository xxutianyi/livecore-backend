<?php

use App\Http\Middleware\BroadcastRoomCache;
use App\Http\Middleware\HandleInertiaRequests;
use App\Response\ApiResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\UnauthorizedException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        channels: __DIR__ . '/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {

        $middleware->statefulApi();
        $middleware->redirectUsersTo(function (Request $request) {
            return $request->expectsJson() ? ApiResponse::authenticated() : '/rooms';
        });
        $middleware->redirectGuestsTo(function (Request $request) {
            return $request->expectsJson() ? ApiResponse::unAuthenticated() : '/login';
        });

        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);

        $middleware->alias([
            'broadcast' => BroadcastRoomCache::class
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        $exceptions->render(function (Throwable $e, Request $request) {
            if ($request->expectsJson()) {
                return match (true) {
                    $e instanceof UnauthorizedException => ApiResponse::unAuthorized(),
                    $e instanceof AuthenticationException => ApiResponse::unAuthenticated(),
                    $e instanceof ValidationException => ApiResponse::validationErrors($e),
                    $e instanceof NotFoundHttpException => ApiResponse::routeNotFound(),
                    $e instanceof ModelNotFoundException => ApiResponse::modelNotFound(),
                    default => ApiResponse::error($e->getMessage(), -1, app()->isLocal() && $e->getTrace()),
                };
            }
            return null;
        });

    })->create();
