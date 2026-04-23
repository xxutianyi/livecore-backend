<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', Rule::unique('users')->ignore($this->user())],
            'email' => ['nullable', 'email', Rule::unique('users')->ignore($this->user())],
            'phone' => ['nullable', 'string', Rule::unique('users')->ignore($this->user())],
        ];
    }

    public function attributes(): array
    {
       return [
           'name' => '名字',
           'phone' => '手机号',
           'email' => '电子邮件',
       ];
    }
}
