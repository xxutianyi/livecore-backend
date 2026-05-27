<?php

namespace App\Http\Requests\Auth;

use App\Rules\PhoneNumber;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', Rule::unique('users')],
            'email' => ['nullable', 'email', Rule::unique('users')],
            'phone' => ['nullable', 'string', Rule::unique('users'), new PhoneNumber],
            'password' => ['required', 'confirmed', Password::defaults()],
            'invitation_code' => ['required', 'string', 'exists:users,inviter_code'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => '名字',
            'email' => '电子邮箱',
            'phone' => '手机号',
            'password' => '密码',
            'invitation_code' => '邀请码',
        ];
    }

    public function messages(): array
    {
        return [
            'password.confirmed' => '两次输入的密码不一致',
            'password.defaults' => '密码强度不足，最少8个字符，并且包含大小写字母和数字'
        ];
    }
}
