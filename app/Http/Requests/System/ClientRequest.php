<?php

namespace App\Http\Requests\System;

use Illuminate\Foundation\Http\FormRequest;

class ClientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('viewAdmin');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string'],
            'whitelist' => ['nullable', 'string'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => '凭证名称',
            'whitelist' => 'IP白名单'
        ];
    }
}
