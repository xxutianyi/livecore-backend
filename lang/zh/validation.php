<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => '应确认勾选 :attribute 。',
    'accepted_if' => '在 :other 为 :value 时应确认勾选 :attribute 。',
    'active_url' => '输入的 :attribute 应为有效的 URL.',
    'after' => '输入的 :attribute 应为 :date 之后的日期。',
    'after_or_equal' => '输入的 :attribute 应为 :date 或之后的日期。',
    'alpha' => '输入的 :attribute 应为拉丁字母。',
    'alpha_dash' => '输入的 :attribute 应只包含小写字母、数字、减号。',
    'alpha_num' => '输入的 :attribute 应只包含字母和数字。',
    'any_of' => '输入的 :attribute 不符合要求。',
    'array' => '输入的 :attribute 应为数组',
    'ascii' => '输入的 :attribute 应为有效的ASCII字符',
    'before' => '输入的 :attribute 应为 :date 之前的日期。',
    'before_or_equal' => '输入的 :attribute 应为 :date 或之前的日期。',
    'between' => [
        'array' => '输入的 :attribute 的项数应 大于 :min 且小于 :max 。',
        'file' => '上传的 :attribute 的文件大小应大于 :min 且小于 :max KB。',
        'numeric' => '输入的 :attribute 应 大于 :min 且小于 :max 。',
        'string' => '输入的 :attribute 应 大于 :min 且小于 :max 个字符。',
    ],
    'boolean' => '输入的 :attribute 应为 true 或 false.',
    'can' => '输入的 :attribute 包含未授权的内容。',
    'confirmed' => '再次输入:attribute和:attribute不一致。',
    'contains' => '输入的 :attribute 缺少必需的内容。',
    'current_password' => '密码输入有误。',
    'date' => '输入的 :attribute 应为有效日期。',
    'date_equals' => '输入的 :attribute 应为 :date 。',
    'date_format' => '输入的 :attribute 应为 :format 格式的日期。',
    'decimal' => '输入的 :attribute 应包含 :decimal 位小数。',
    'declined' => '不应勾选确认 :attribute 。',
    'declined_if' => '在 :other 为 :value 不应勾选确认 :attribute 。',
    'different' => ':attribute 和 :other 应为不同内容',
    'digits' => '输入的 :attribute 应为 :digits 位数字。',
    'digits_between' => '输入的 :attribute 位数应在 :min 和 :max 位之间。',
    'dimensions' => '上传的 :attribute 不满足分辨率要求。',
    'distinct' => '输入的 :attribute 包含重复的值。',
    'doesnt_contain' => ':attribute 不应包含以下内容： :values。',
    'doesnt_end_with' => '输入的 :attribute 不能以 :values 结尾。',
    'doesnt_start_with' => '输入的 :attribute 不能以 :values 开始。',
    'email' => '输入的 :attribute 应为有效邮箱地址。',
    'encoding' => '输入的 :attribute 应为 :encoding 编码。',
    'ends_with' => '输入的 :attribute 应以 :values 结尾。',
    'enum' => '选择的 :attribute 不在有效范围。',
    'exists' => '选择的 :attribute 不在有效范围。',
    'extensions' => '上传的 :attribute 扩展名应为 :values 。',
    'file' => ':attribute 字段应为文件。',
    'filled' => '应输入 :attribute 。',
    'gt' => [
        'array' => '输入的 :attribute 应大于 :size 项。',
        'file' => '上传的 :attribute 应大于 :size KB.',
        'numeric' => '输入的 :attribute 应大于 :size。',
        'string' => '输入的 :attribute 应大于 :size 个字符。',
    ],
    'gte' => [
        'array' => '输入的 :attribute 应不少于 :size 项。',
        'file' => '上传的 :attribute 应不少于 :size KB.',
        'numeric' => '输入的 :attribute 应不少于 :size。',
        'string' => '输入的 :attribute 应不少于 :size 个字符。',
    ],
    'hex_color' => '输入的 :attribute 应为有效的HEX颜色。',
    'image' => '上传的 :attribute 应为图片。',
    'in' => '选择的 :attribute 不在有效范围。',
    'in_array' => '输入的 :attribute 应包含在 :other 中。',
    'in_array_keys' => '输入的 :attribute 应包含以下键： :values。',
    'integer' => '输入的 :attribute 应为数字。',
    'ip' => '输入的 :attribute 应为有效的IP地址。',
    'ipv4' => '输入的 :attribute 应为有效的IPv4地址。',
    'ipv6' => '输入的 :attribute 应为有效的IPv6地址。',
    'json' => '输入的 :attribute 应为有效的JSON字符串。',
    'list' => '输入的 :attribute 应为列表。',
    'lowercase' => '输入的 :attribute 应为小写。',
    'lt' => [
        'array' => '输入的 :attribute 应小于 :size 项。',
        'file' => '上传的 :attribute 应小于 :size KB.',
        'numeric' => '输入的 :attribute 应小于 :size。',
        'string' => '输入的 :attribute 应小于 :size 个字符。',
    ],
    'lte' => [
        'array' => '输入的 :attribute 应不超过 :size 项。',
        'file' => '上传的 :attribute 应不超过 :size KB.',
        'numeric' => '输入的 :attribute 应不超过 :size。',
        'string' => '输入的 :attribute 应不超过 :size 个字符。',
    ],
    'mac_address' => '输入的 :attribute 应为有效的Mac地址。',
    'max' => [
        'array' => '输入的 :attribute 应不大于 :max 个项。',
        'file' => '上传的 :attribute 文件大小应不大于 :max KB.',
        'numeric' => '输入的 :attribute 应不大于 :max。',
        'string' => '输入的 :attribute 应不大于 :max 个字符。',
    ],
    'max_digits' => '输入的 :attribute 应不超过 :max 位。',
    'mimes' => '上传的 :attribute 文件应为 :values 类型。',
    'mimetypes' => '上传的 :attribute 文件应为 :values 类型。',
    'min' => [
        'array' => '输入的 :attribute 应不小于 :max 个项。',
        'file' => '上传的 :attribute 文件大小应不小于 :max KB.',
        'numeric' => '输入的 :attribute 应不小于 :max。',
        'string' => '输入的 :attribute 应不小于 :max 个字符。',
    ],
    'min_digits' => '输入的 :attribute 应不少于 :max 位。',
    'missing' => ':attribute 应留空。',
    'missing_if' => '当 :other 为 :value 时，:attribute 应留空。',
    'missing_unless' => '除非 :other 为 :value 时，:attribute 应留空。',
    'missing_with' => '当输入了 :other 时，:attribute 应留空。',
    'missing_with_all' => '当输入了 :other 时，:attribute 应留空。',
    'multiple_of' => ':attribute 应为多个 :value。',
    'not_in' => '选择的 :attribute 不在有效范围。',
    'not_regex' => '输入的 :attribute 不符合格式要求。',
    'numeric' => '输入的 :attribute 应为数字',
    'password' => [
        'letters' => '输入的 :attribute 应至少包含一个字母。',
        'mixed' => '输入的 :attribute 应至少包含一个大写字母和一个小写字母。',
        'numbers' => '输入的 :attribute 应至少包含一个数字。',
        'symbols' => '输入的 :attribute 应至少包含一个特殊符号。',
        'uncompromised' => '输入的 :attribute 存在数据泄露风险，请输入另一个 :attribute。',
    ],
    'present' => ':attribute 必须输入内容。',
    'present_if' => '当 :other 为 :value 时，:attribute 必须输入内容。',
    'present_unless' => '除非 :other 为 :value 时，:attribute 必须输入内容。',
    'present_with' => '当输入了 :other 时，:attribute 必须输入内容。',
    'present_with_all' => '当输入了 :other 时，:attribute 必须输入内容。',
    'prohibited' => '禁止输入 :attribute 。',
    'prohibited_if' => '当 :other 为 :value 时，禁止输入 :attribute 。',
    'prohibited_if_accepted' => '当勾选确认 :other 时，禁止输入 :attribute 。',
    'prohibited_if_declined' => '当不勾选确认 :other 时，禁止输入 :attribute 。',
    'prohibited_unless' => '除非 :other 为 :value 时，禁止输入 :attribute 。',
    'prohibits' => ':attribute 字段禁止了 :other 。',
    'regex' => '输入的 :attribute 不符合格式要求。',
    'required' => ':attribute 是必填项。',
    'required_array_keys' => '输入的 :attribute 必须包含 :values。',
    'required_if' => '当 :other 为 :value 时，:attribute 是必填项。',
    'required_if_accepted' => '当勾选确认 :other 时，:attribute 是必填项。',
    'required_if_declined' => '当不勾选确认 :other 时，:attribute 是必填项。',
    'required_unless' => '除非 :other 为 :value 时，:attribute 是必填项。',
    'required_with' => '当输入了 :other 时，:attribute 是必填项。',
    'required_with_all' => '当输入了 :other 时，:attribute 是必填项。',
    'required_without' => '当未输入 :other 时，:attribute 是必填项。',
    'required_without_all' => '当未输入 :other 时，:attribute 是必填项。',
    'same' => ':attribute 需和 :other 一致。',
    'size' => [
        'array' => '输入的 :attribute 应包含 :size 项。',
        'file' => '上传的 :attribute 应为 :size KB.',
        'numeric' => '输入的 :attribute 应为 :size。',
        'string' => '输入的 :attribute 应为 :size 个字符。',
    ],
    'starts_with' => '输入的 :attribute 应以 :values 开始。',
    'string' => '输入的 :attribute 应为字符串。',
    'timezone' => '输入的 :attribute 应为有效时区。',
    'unique' => ':attribute 重复，请修改后重试。',
    'uploaded' => ':attribute 上传失败。',
    'uppercase' => '输入的 :attribute 应为大写。',
    'url' => '输入的 :attribute 应为有效的URL。',
    'ulid' => '输入的 :attribute 应为有效的ULID。',
    'uuid' => '输入的 :attribute 应为有效的UUID。',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [
        'new_password' => '新密码',
        'current_password' => '当前密码',
    ],

];
