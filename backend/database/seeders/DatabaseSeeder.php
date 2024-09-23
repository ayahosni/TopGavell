<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Auction;
use App\Models\Customer;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create 1 admin user
        User::factory()->create([
            'role' => 'admin',
        ]);
        Auction::factory()->count(3)->create();
    }
}
