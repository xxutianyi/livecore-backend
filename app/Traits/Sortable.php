<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait Sortable
{
    public function scopeSort(Builder $query, ?string $sorts = null): Builder
    {
        if (empty($sorts)) {
            return $query->latest();
        }

        $sorts = mb_split(',', $sorts);

        if ($sorts) {
            foreach ($sorts as $sort) {
                $sort = mb_split(':', $sort);

                if (isset($sort[0]) && isset($sort[1])) {
                    $column = $sort[0];
                    $direction = strtolower($sort[1]) == 'asc' ? 'asc' : 'desc';

                    if (in_array($column, $this->getSortableColumns())) {
                        $query->orderBy($column, $direction);
                    }
                }
            }
        }

        return $query;
    }

    protected function getSortableColumns(): array
    {
        return $this->sortable ?? [];
    }
}
