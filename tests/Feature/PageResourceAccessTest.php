<?php

namespace Tests\Feature;

use App\Filament\Admin\Resources\PageResource;
use Tests\TestCase;

class PageResourceAccessTest extends TestCase
{
    public function test_page_resource_is_hidden_from_filament_navigation(): void
    {
        $this->assertFalse(PageResource::canAccess());
    }
}
