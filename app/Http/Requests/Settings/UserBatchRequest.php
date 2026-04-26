<?php

namespace App\Http\Requests\Settings;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UserBatchRequest extends FormRequest
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
            'user_ids' => ['required', 'array'],
            'user_ids.*' => ['required', 'uuid', 'exists:users,id'],
            'group_ids' => ['required', 'array'],
            'group_ids.*' => ['required', 'exists:user_groups,id'],
        ];
    }

    public function attributes(): array
    {
        return [
            'user_ids' => '选择的用户',
            'user_ids.*' => '选择的用户',
            'group_ids' => '分组',
            'group_ids.*' => '分组',
        ];
    }
}
