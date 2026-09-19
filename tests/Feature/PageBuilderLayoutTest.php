<?php

namespace Tests\Feature;

use App\Models\Page;
use Tests\TestCase;

class PageBuilderLayoutTest extends TestCase
{
    public function test_sections_without_defined_columns_are_normalized_for_page_builder(): void
    {
        $layout = Page::normalizeLayout([
            [
                'id' => 'section-1',
                'column_count' => 3,
                'columns' => [
                    ['width' => 'w-full', 'components' => []],
                    ['width' => 'w-full', 'components' => []],
                ],
            ],
        ]);

        $this->assertCount(1, $layout);
        $this->assertCount(3, $layout[0]['columns']);
        $this->assertSame('w-1/3', $layout[0]['columns'][0]['width']);
        $this->assertSame('w-1/3', $layout[0]['columns'][1]['width']);
        $this->assertSame('w-1/3', $layout[0]['columns'][2]['width']);
    }
}
