<?php

namespace App\Http\Requests\System;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ServiceAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('viewAdmin');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', Rule::unique('users')->ignore($this->route('service_account'))],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => '名称',
        ];
    }
}
