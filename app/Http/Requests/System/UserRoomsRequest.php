<?php

namespace App\Http\Requests\System;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UserRoomsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('viewAdmin');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'room_ids' => ['nullable', 'array'],
            'room_ids.*' => ['required', 'uuid', 'exists:live_rooms,id'],
        ];
    }

    public function attributes(): array
    {
        return [
            'room_ids' => '直播间',
            'room_ids.*' => '直播间'
        ];
    }
}
