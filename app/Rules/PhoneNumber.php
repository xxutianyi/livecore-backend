<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class PhoneNumber implements ValidationRule
{
    /**
     * 运行验证规则。
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $pattern = implode('|', [
            '1((3[0-9])|(4[0,14-9])|(5[0-3,5-9])|(6[2,567])|(7[0-8])|(8[0-9])|(9[0-3,5-9]))[0-9]{8}$', // 大陆手机号
            '(5|6|7|9)\d{7}$', // 港澳手机号
        ]);

        if (! preg_match("/^$pattern/", $value)) {
            $fail('手机号格式不正确');
        }
    }
}
