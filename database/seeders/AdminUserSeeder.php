<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@example.com')],
            [
                'first' => env('ADMIN_FIRST', 'Admin'),
                'last' => env('ADMIN_LAST', 'User'),
                'password' => env('ADMIN_PASSWORD', 'change-this-password'),
            ]
        );

        Page::firstOrCreate(
            ['slug' => 'home'],
            [
                'title' => 'Home',
                'layout' => [
                    [
                        'id' => 'row-home-hero',
                        'columns' => [
                            [
                                'width' => 'w-full',
                                'components' => [
                                    [
                                        'type' => 'hero',
                                        'data' => [
                                            'title' => 'Welkom op mijn portfolio',
                                            'subtitle' => 'Software Engineer',
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ]
        );
    }
}