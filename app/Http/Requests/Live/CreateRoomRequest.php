<?php

namespace App\Http\Requests\Live;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateRoomRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'cover' => ['required', Rule::filepond(['mimetypes:image/*'])],
        ];
    }


    public function attributes(): array
    {
        return [
            'name' => '名称',
            'description' => '简介',
            'cover' => '封面'
        ];
    }
}
