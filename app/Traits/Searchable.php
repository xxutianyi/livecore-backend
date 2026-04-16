<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait Searchable
{
    public function scopeSearch(Builder $query, ?string $search = null): Builder
    {
        if (empty($search)) {
            return $query;
        }

        $search = trim($search);
        $keywords = preg_split('/\s+/', $search);   // 支持多个关键词（如 "张 三"）

        return $query->where(function (Builder $q) use ($keywords) {
            foreach ($keywords as $keyword) {
                $keyword = '%' . $keyword . '%';

                $q->orWhere(function (Builder $sub) use ($keyword) {
                    foreach ($this->getSearchableColumns() as $column) {
                        $sub->orWhere($column, 'LIKE', $keyword);
                    }
                });
            }
        });
    }

    protected function getSearchableColumns(): array
    {
        return $this->searchable ?? [];
    }
}
