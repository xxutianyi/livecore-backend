<?php

namespace App\Http\Requests\Client;

use Illuminate\Foundation\Http\FormRequest;

class AudienceCreateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'group_ids' => ['required', 'array', 'min:1'],
            'group_ids.*' => ['required', 'uuid', 'exists:user_groups,id'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => '用户名',
            'phone' => '手机号',
            'email' => '电子邮件',
            'group_ids' => '用户分组',
            'group_ids.*' => '用户分组',
        ];
    }
}
