<?php

namespace App\Http\Requests\System;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('viewRoomAdmin');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'role' => ['required', 'string', 'in:admin,room-admin'],
            'name' => ['required', 'string', Rule::unique('users')->ignore($this->route('user'))],
            'email' => ['nullable', 'email', Rule::unique('users')->ignore($this->route('user'))],
            'phone' => ['nullable', 'string', Rule::unique('users')->ignore($this->route('user'))],
        ];
    }

    public function attributes(): array
    {
        return [
            'role' => '角色',
            'name' => '姓名',
            'phone' => '手机号',
            'email' => '电子邮件',
        ];
    }
}
