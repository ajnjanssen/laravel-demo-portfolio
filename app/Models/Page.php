<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Page extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'parent_id',
        'status',
        'layout',
    ];

    protected $casts = [
        'layout' => 'array',
    ];

    public static function normalizeLayout(?array $layout): array
    {
        if (empty($layout)) {
            return [];
        }

        $normalized = [];

        foreach ($layout as $sectionIndex => $section) {
            if (!is_array($section)) {
                continue;
            }

            $sectionId = $section['id'] ?? 'section-' . ($sectionIndex + 1);
            $columnCount = isset($section['column_count']) ? max(1, (int) $section['column_count']) : 1;
            $columns = is_array($section['columns'] ?? null) ? $section['columns'] : [];

            if ($columns === []) {
                $columns = [];
                for ($i = 0; $i < $columnCount; $i++) {
                    $columns[] = [
                        'id' => 'column-' . ($sectionIndex + 1) . '-' . ($i + 1),
                        'width' => self::columnWidthForIndex($i, $columnCount),
                        'components' => [],
                    ];
                }
            }

            $normalizedColumns = [];
            $effectiveCount = max($columnCount, count($columns));

            for ($columnIndex = 0; $columnIndex < $effectiveCount; $columnIndex++) {
                $column = $columns[$columnIndex] ?? [];
                $defaultWidth = self::columnWidthForIndex($columnIndex, $effectiveCount);
                $shouldUseDefaultWidth = !isset($column['width']) || $effectiveCount > count($columns) || (count($columns) === $effectiveCount && $column['width'] === 'w-full' && $effectiveCount > 1);

                $normalizedColumns[] = [
                    'id' => $column['id'] ?? 'column-' . ($sectionIndex + 1) . '-' . ($columnIndex + 1),
                    'width' => $shouldUseDefaultWidth ? $defaultWidth : $column['width'],
                    'components' => is_array($column['components'] ?? null) ? array_values(array_map(function (array $component) {
                        return [
                            'type' => $component['type'] ?? 'text-block',
                            'data' => is_array($component['data'] ?? null) ? $component['data'] : [],
                        ];
                    }, $column['components'])) : [],
                ];
            }

            $normalized[] = [
                'id' => $sectionId,
                'column_count' => $effectiveCount,
                'columns' => $normalizedColumns,
            ];
        }

        return $normalized;
    }

    protected static function columnWidthForIndex(int $columnIndex, int $columnCount): string
    {
        $map = [
            1 => ['w-full'],
            2 => ['w-1/2', 'w-1/2'],
            3 => ['w-1/3', 'w-1/3', 'w-1/3'],
            4 => ['w-1/4', 'w-1/4', 'w-1/4', 'w-1/4'],
        ];

        $widths = $map[$columnCount] ?? ['w-full'];

        return $widths[$columnIndex] ?? 'w-full';
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }
}