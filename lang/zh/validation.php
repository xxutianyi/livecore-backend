<?php

return [

    /*
    |--------------------------------------------------------------------------
    |ValidationLanguageLines
    |--------------------------------------------------------------------------
    |
    |Thefollowinglanguagelinescontainthedefaulterrormessagesusedby
    |thevalidatorclass.Someoftheseruleshavemultipleversionssuch
    |asthesizerules.Feelfreetotweakeachofthesemessageshere.
    |
    */

    'accepted' => '应确认勾选:attribute。',
    'accepted_if' => '在:other为:value时应确认勾选:attribute。',
    'active_url' => ':attribute应为有效的URL.',
    'after' => ':attribute应为:date之后的日期。',
    'after_or_equal' => ':attribute应为:date或之后的日期。',
    'alpha' => ':attribute应为拉丁字母。',
    'alpha_dash' => ':attribute应只包含小写字母、数字、减号。',
    'alpha_num' => ':attribute应只包含字母和数字。',
    'any_of' => ':attribute不符合要求。',
    'array' => ':attribute应为数组',
    'ascii' => ':attribute应为有效的ASCII字符',
    'before' => ':attribute应为:date之前的日期。',
    'before_or_equal' => ':attribute应为:date或之前的日期。',
    'between' => [
        'array' => ':attribute的项数应大于:min且小于:max。',
        'file' => '上传的:attribute的文件大小应大于:min且小于:maxKB。',
        'numeric' => ':attribute应大于:min且小于:max。',
        'string' => ':attribute应大于:min且小于:max个字符。',
    ],
    'boolean' => ':attribute应为true或false.',
    'can' => ':attribute包含未授权的内容。',
    'confirmed' => '再次输入:attribute和:attribute不一致。',
    'contains' => ':attribute缺少必需的内容。',
    'current_password' => '密码输入有误。',
    'date' => ':attribute应为有效日期。',
    'date_equals' => ':attribute应为:date。',
    'date_format' => ':attribute应为:format格式的日期。',
    'decimal' => ':attribute应包含:decimal位小数。',
    'declined' => '不应勾选确认:attribute。',
    'declined_if' => '在:other为:value不应勾选确认:attribute。',
    'different' => ':attribute和:other应为不同内容',
    'digits' => ':attribute应为:digits位数字。',
    'digits_between' => ':attribute位数应在:min和:max位之间。',
    'dimensions' => '上传的:attribute不满足分辨率要求。',
    'distinct' => ':attribute包含重复的值。',
    'doesnt_contain' => ':attribute不应包含以下内容：:values。',
    'doesnt_end_with' => ':attribute不能以:values结尾。',
    'doesnt_start_with' => ':attribute不能以:values开始。',
    'email' => ':attribute应为有效邮箱地址。',
    'encoding' => ':attribute应为:encoding编码。',
    'ends_with' => ':attribute应以:values结尾。',
    'enum' => ':attribute无效。',
    'exists' => ':attribute不存在。',
    'extensions' => '上传的:attribute扩展名应为:values。',
    'file' => ':attribute字段应为文件。',
    'filled' => '应输入:attribute。',
    'gt' => [
        'array' => ':attribute应大于:size项。',
        'file' => '上传的:attribute应大于:sizeKB.',
        'numeric' => ':attribute应大于:size。',
        'string' => ':attribute应大于:size个字符。',
    ],
    'gte' => [
        'array' => ':attribute应不少于:size项。',
        'file' => '上传的:attribute应不少于:sizeKB.',
        'numeric' => ':attribute应不少于:size。',
        'string' => ':attribute应不少于:size个字符。',
    ],
    'hex_color' => ':attribute应为有效的HEX颜色。',
    'image' => '上传的:attribute应为图片。',
    'in' => '选择的:attribute不在有效范围。',
    'in_array' => ':attribute应包含在:other中。',
    'in_array_keys' => ':attribute应包含以下键：:values。',
    'integer' => ':attribute应为数字。',
    'ip' => ':attribute应为有效的IP地址。',
    'ipv4' => ':attribute应为有效的IPv4地址。',
    'ipv6' => ':attribute应为有效的IPv6地址。',
    'json' => ':attribute应为有效的JSON字符串。',
    'list' => ':attribute应为列表。',
    'lowercase' => ':attribute应为小写。',
    'lt' => [
        'array' => ':attribute应小于:size项。',
        'file' => '上传的:attribute应小于:sizeKB.',
        'numeric' => ':attribute应小于:size。',
        'string' => ':attribute应小于:size个字符。',
    ],
    'lte' => [
        'array' => ':attribute应不超过:size项。',
        'file' => '上传的:attribute应不超过:sizeKB.',
        'numeric' => ':attribute应不超过:size。',
        'string' => ':attribute应不超过:size个字符。',
    ],
    'mac_address' => ':attribute应为有效的Mac地址。',
    'max' => [
        'array' => ':attribute应不大于:max个项。',
        'file' => '上传的:attribute文件大小应不大于:maxKB.',
        'numeric' => ':attribute应不大于:max。',
        'string' => ':attribute应不大于:max个字符。',
    ],
    'max_digits' => ':attribute应不超过:max位。',
    'mimes' => '上传的:attribute文件应为:values类型。',
    'mimetypes' => '上传的:attribute文件应为:values类型。',
    'min' => [
        'array' => ':attribute应不小于:min个项。',
        'file' => ':attribute文件大小应不小于:minKB.',
        'numeric' => ':attribute应不小于:min。',
        'string' => ':attribute应不小于:min个字符。',
    ],
    'min_digits' => ':attribute应不少于:max位。',
    'missing' => ':attribute应留空。',
    'missing_if' => '当:other为:value时，:attribute应留空。',
    'missing_unless' => '除非:other为:value时，:attribute应留空。',
    'missing_with' => '当输入了:other时，:attribute应留空。',
    'missing_with_all' => '当输入了:other时，:attribute应留空。',
    'multiple_of' => ':attribute应为多个:value。',
    'not_in' => '选择的:attribute不在有效范围。',
    'not_regex' => ':attribute不符合格式要求。',
    'numeric' => ':attribute应为数字',
    'password' => [
        'letters' => ':attribute应至少包含一个字母。',
        'mixed' => ':attribute应至少包含一个大写字母和一个小写字母。',
        'numbers' => ':attribute应至少包含一个数字。',
        'symbols' => ':attribute应至少包含一个特殊符号。',
        'uncompromised' => ':attribute存在数据泄露风险，请输入另一个:attribute。',
    ],
    'present' => ':attribute必须输入内容。',
    'present_if' => '当:other为:value时，:attribute必须输入内容。',
    'present_unless' => '除非:other为:value时，:attribute必须输入内容。',
    'present_with' => '当输入了:other时，:attribute必须输入内容。',
    'present_with_all' => '当输入了:other时，:attribute必须输入内容。',
    'prohibited' => '禁止输入:attribute。',
    'prohibited_if' => '当:other为:value时，禁止输入:attribute。',
    'prohibited_if_accepted' => '当勾选确认:other时，禁止输入:attribute。',
    'prohibited_if_declined' => '当不勾选确认:other时，禁止输入:attribute。',
    'prohibited_unless' => '除非:other为:value时，禁止输入:attribute。',
    'prohibits' => ':attribute字段禁止了:other。',
    'regex' => ':attribute不符合格式要求。',
    'required' => ':attribute是必填项。',
    'required_array_keys' => ':attribute必须包含:values。',
    'required_if' => '当:other为:value时，:attribute是必填项。',
    'required_if_accepted' => '当勾选确认:other时，:attribute是必填项。',
    'required_if_declined' => '当不勾选确认:other时，:attribute是必填项。',
    'required_unless' => '除非:other为:value时，:attribute是必填项。',
    'required_with' => '当输入了:other时，:attribute是必填项。',
    'required_with_all' => '当输入了:other时，:attribute是必填项。',
    'required_without' => '当未输入:other时，:attribute是必填项。',
    'required_without_all' => '当未输入:other时，:attribute是必填项。',
    'same' => ':attribute需和:other一致。',
    'size' => [
        'array' => ':attribute应包含:size项。',
        'file' => '上传的:attribute应为:sizeKB.',
        'numeric' => ':attribute应为:size。',
        'string' => ':attribute应为:size个字符。',
    ],
    'starts_with' => ':attribute应以:values开始。',
    'string' => ':attribute应为字符串。',
    'timezone' => ':attribute应为有效时区。',
    'unique' => ':attribute重复，请修改后重试。',
    'uploaded' => ':attribute上传失败。',
    'uppercase' => ':attribute应为大写。',
    'url' => ':attribute应为有效的URL。',
    'ulid' => ':attribute应为有效的ULID。',
    'uuid' => ':attribute应为有效的UUID。',

    /*
    |--------------------------------------------------------------------------
    |CustomValidationLanguageLines
    |--------------------------------------------------------------------------
    |
    |Hereyoumayspecifycustomvalidationmessagesforattributesusingthe
    |convention"attribute.rule"tonamethelines.Thismakesitquickto
    |specifyaspecificcustomlanguagelineforagivenattributerule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    |CustomValidationAttributes
    |--------------------------------------------------------------------------
    |
    |Thefollowinglanguagelinesareusedtoswapourattributeplaceholder
    |withsomethingmorereaderfriendlysuchas"E-MailAddress"instead
    |of"email".Thissimplyhelpsusmakeourmessagemoreexpressive.
    |
    */

    'attributes' => [
//
    ],

];
