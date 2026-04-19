<?php

namespace App\Utils;

use Illuminate\Contracts\Filesystem\FileNotFoundException;
use RahulHaque\Filepond\Facades\Filepond;

class FilepondSave
{
    public static function save(string $field, string $file)
    {
        try {
            $info = Filepond::field($field)->moveTo($file);

            return $info['url'];
        } catch (FileNotFoundException) {
            abort(500);
        }
    }
}
