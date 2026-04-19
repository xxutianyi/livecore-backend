<?php

namespace App\Traits;

use Illuminate\Support\Collection;

trait Optionable
{
    public static function options(array $columns = ['id', 'name']): Collection
    {
        return self::select($columns)->get();
    }
}
