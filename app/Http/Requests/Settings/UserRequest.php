<?php

namespace App\Http\Requests\Settings;

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
            'name' => ['required', 'string', Rule::unique('users')->ignore($this->route('user'))],
            'email' => ['nullable', 'email', Rule::unique('users')->ignore($this->route('user'))],
            'phone' => ['nullable', 'string', Rule::unique('users')->ignore($this->route('user'))],
            'group_ids' => ['nullable', 'array'],
            'group_ids.*' => ['nullable', 'exists:user_groups,id'],
            'invitation_code' => ['nullable', 'string', 'exists:users,inviter_code'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => '姓名',
            'email' => '手机号',
            'phone' => '邮箱',
            'group_ids' => '用户分组',
            'group_ids.*' => '用户分组',
            'invitation_code' => '邀请人代码',
        ];
    }
}
