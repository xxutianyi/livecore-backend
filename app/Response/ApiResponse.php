<?php

namespace App\Response;

use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class ApiResponse
{
    public static function success(mixed $data = null): JsonResponse
    {
        $response = [
            'code' => 0,
            'data' => $data,
            'message' => 'success',
            'errors' => null
        ];

        return response()->json($response);
    }

    public static function error(string $message, int $code, mixed $errors = null): JsonResponse
    {

        $response = [
            'data' => null,
            'code' => $code,
            'message' => $message,
            'errors' => $errors
        ];

        return response()->json($response);
    }

    public static function unAuthorized(): JsonResponse
    {
        return ApiResponse::error('权限不足', 4000);
    }

    public static function authenticated(): JsonResponse
    {
        return ApiResponse::error('用户已登录', 4001);
    }

    public static function unAuthenticated(): JsonResponse
    {
        return ApiResponse::error('请登录后操作', 4002);
    }

    public static function validationErrors(ValidationException $errors): JsonResponse
    {
        return ApiResponse::error('提交的数据验证失败', 4003, $errors->errors());
    }

    public static function routeNotFound(): JsonResponse
    {
        return ApiResponse::error('访问的路径不存在', 4004);
    }

    public static function modelNotFound(): JsonResponse
    {
        return ApiResponse::error('访问的资源不存在', 4005);
    }
}
