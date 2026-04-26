<?php

namespace App\Http\Requests\Settings;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RoomGroupRequest extends FormRequest
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
            'group_ids' => ['nullable', 'array'],
            'group_ids.*' => ['required', 'exists:user_groups,id'],
        ];
    }

    public function attributes(): array
    {
        return [
            'group_ids' => '授权分组',
            'group_ids.*' => '授权分组'
        ];
    }
}
