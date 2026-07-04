<?php

namespace App\Http\Requests\Client;

use Illuminate\Foundation\Http\FormRequest;

class AudienceGroupsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'group_ids' => ['required', 'array', 'min:1'],
            'group_ids.*' => ['required', 'uuid', 'exists:user_groups,id'],
        ];
    }

    public function attributes(): array
    {
        return [
            'group_ids' => '用户分组',
            'group_ids.*' => '用户分组',
        ];
    }
}
