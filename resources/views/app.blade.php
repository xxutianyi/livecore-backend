<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
        <meta name="csrf-token" content="{{ csrf_token() }}" />

        <title>{{ config('app.name') }}</title>
        <link rel="icon" src="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" src="/favicon.png" type="image/png" />

        @auth
            <script src="https://tam.cdn-go.cn/aegis-sdk/latest/aegis.min.js"></script>
            <script>
                if (typeof Aegis === 'function') {
                    window.aegis = new Aegis({
                        id: 'qVxyauLodmRbOJO5ox',
                        uin: @json(auth()->id()),
                        reportApiSpeed: true,
                        reportAssetSpeed: true,
                        spa: true,
                        hostUrl: 'https://rumt-zh.com',
                    });
                }
            </script>
        @endauth

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
