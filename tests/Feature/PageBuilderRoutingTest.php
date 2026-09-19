<?php

namespace Tests\Feature;

use App\Models\Page;
use App\Models\User;
use Tests\TestCase;

class PageBuilderRoutingTest extends TestCase
{
    public function test_admin_edit_page_loads_custom_builder(): void
    {
        $user = User::factory()->create();
        $page = Page::create([
            'title' => 'About',
            'slug' => 'about',
            'status' => 'draft',
            'layout' => [],
        ]);

        $this->actingAs($user)
            ->get('/admin/pages/' . $page->getKey() . '/edit')
            ->assertOk();
    }
}
