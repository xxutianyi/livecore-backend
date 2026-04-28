<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class TokenRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
            'device_name' => ['required', 'string'],
        ];
    }

    public function attributes(): array
    {
        return [
            'username' => '用户名',
            'password' => '密码',
            'device_name' => '设备名称'
        ];
    }

    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        if ((!Auth::attempt(['name' => $this->string('username'), 'password' => $this->string('password')]))
            && (!Auth::attempt(['phone' => $this->string('username'), 'password' => $this->string('password')]))
            && (!Auth::attempt(['email' => $this->string('username'), 'password' => $this->string('password')]))) {

            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'username' => __('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    public function ensureIsNotRateLimited(): void
    {
        if (!RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'username' => __('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->ip().'|'. $this->input('device_name')));
    }
}
