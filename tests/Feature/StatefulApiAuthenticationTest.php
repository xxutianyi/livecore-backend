<?php

use Illuminate\Contracts\Http\Kernel;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

test('api routes support Sanctum session authentication', function () {
    expect(app(Kernel::class)->getMiddlewareGroups()['api'])
        ->toContain(EnsureFrontendRequestsAreStateful::class);
});
