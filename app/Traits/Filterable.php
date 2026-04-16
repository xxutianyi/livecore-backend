<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait Filterable
{
    public function scopeFilter(Builder $query, ?array $filters = null): Builder
    {
        if (empty($filters) || empty($this->filterable)) {
            return $query;
        }

        foreach ($filters as $field => $value) {
            if (empty($value) && $value !== 0 && $value !== false) {
                continue;
            }

            if (in_array($field, $this->getFilterableColumns())) {
                if (is_bool($value) || $value == 'true' || $value == 'false') {
                    $query->where($field, filter_var($value, FILTER_VALIDATE_BOOLEAN));
                } else {
                    $query->where($field, $value);
                }
            }
        }

        return $query;
    }

    protected function getFilterableColumns(): array
    {
        return $this->filterable ?? [];
    }
}
