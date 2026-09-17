<?php

namespace Database\Seeders;

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
    }
}