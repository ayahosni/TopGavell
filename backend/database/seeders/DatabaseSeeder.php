<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => '$2y$12$XK/q7owioqGub6KRqLa5YOFuO8U3w7Wn6fxjNOGUwgfgZ4K/CR402', // Hashed password
                'OTP' => null,
                'remember_token' => null,
                'role' => 'admin',
                'profile_picture' => null,
                'is_email_verified' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Customer_One',
                'email' => 'customer1@example.com',
                'password' => '$2y$12$XK/q7owioqGub6KRqLa5YOFuO8U3w7Wn6fxjNOGUwgfgZ4K/CR402',
                'OTP' => null,
                'remember_token' => null,
                'role' => 'customer',
                'profile_picture' => null,
                'is_email_verified' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Customer_Two',
                'email' => 'customer2@example.com',
                'password' => '$2y$12$XK/q7owioqGub6KRqLa5YOFuO8U3w7Wn6fxjNOGUwgfgZ4K/CR402',
                'OTP' => null,
                'remember_token' => null,
                'role' => 'customer',
                'profile_picture' => null,
                'is_email_verified' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
        DB::table('customers')->insert([
            [
                'phone_number' => '123-456-7890',
                'address' => '123 Main Street, City, Country',
                'user_id' => 2, // Referring to Customer_One
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'phone_number' => '987-654-3210',
                'address' => '456 Another St, City, Country',
                'user_id' => 3, // Referring to Customer_Two
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
        DB::table('categories')->insert([
            ['name' => 'Electronics', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Jewelry', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Art', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Automobiles', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Collectibles', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Furniture', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Real Estate', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Books', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Sports Equipment', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Clothing', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Toys', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Music Instruments', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Home Appliances', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Antiques', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Others', 'created_at' => now(), 'updated_at' => now()],
        ]);
##############################################################################################
        // $now = Carbon::now();
        $currentTime = Carbon::now('UTC')->setTimezone('Africa/Cairo');
        $auctions = [
            [
                'customer_id' => 1,
                'category_id' => 1,
                'winning_bidder_id' => 2,
                'item_name' => 'Smartphone',
                'item_description' => 'Latest model smartphone.',
                'starting_bid' => 800.00,
                'bid_increment' => 50.00,
                'auction_start_time' => $currentTime->copy()->subDays(5)->setTime(10, 0), // started 5 days ago
                'auction_end_time' => $currentTime->copy()->subDays(4)->setTime(10, 0),   // ended 4 days ago
                'auction_actual_end_time' => $currentTime->copy()->subDays(4)->setTime(10, 0),
                'auction_status' => 'Closed',
                'approval_status' => 'approved',
                'item_country' => 'USA',
                'created_at' => $currentTime,
                'updated_at' => $currentTime,
            ],
            [
                'customer_id' => 2,
                'category_id' => 2,
                'winning_bidder_id' => null,
                'item_name' => 'Diamond Ring',
                'item_description' => 'Luxury diamond ring.',
                'starting_bid' => 5000.00,
                'bid_increment' => 100.00,
                'auction_start_time' => $currentTime->copy()->subHours(2),  // started 2 hours ago
                'auction_end_time' => $currentTime->copy()->addHours(22),   // ends tomorrow
                'auction_actual_end_time' =>null,
                'auction_status' => 'Open',
                'approval_status' => 'approved',
                'item_country' => 'France',
                'created_at' => $currentTime,
                'updated_at' => $currentTime,
            ],
            [
                'customer_id' => 1,
                'category_id' => 3,
                'winning_bidder_id' => 2,
                'item_name' => 'Painting',
                'item_description' => 'Famous artwork.',
                'starting_bid' => 1500.00,
                'bid_increment' => 100.00,
                'auction_start_time' => $currentTime->copy()->subDays(2)->setTime(12, 0),  // started 2 days ago
                'auction_end_time' => $currentTime->copy()->subDay()->setTime(12, 0),      // ended yesterday
                'auction_actual_end_time' => $currentTime->copy()->subDay()->setTime(12, 0),
                'auction_status' => 'Closed',
                'approval_status' => 'approved',
                'item_country' => 'Italy',
                'created_at' => $currentTime,
                'updated_at' => $currentTime,
            ],
            [
                'customer_id' => 2,
                'category_id' => 4,
                'winning_bidder_id' => null,
                'item_name' => 'Sports Car',
                'item_description' => 'High-end sports car.',
                'starting_bid' => 30000.00,
                'bid_increment' => 500.00,
                'auction_start_time' => $currentTime->copy()->addDays(1)->setTime(14, 0), // starts tomorrow
                'auction_end_time' => $currentTime->copy()->addDays(2)->setTime(14, 0),   // ends in 2 days
                'auction_actual_end_time' => null,
                'auction_status' => 'Closed',
                'approval_status' => 'pending',
                'item_country' => 'Germany',
                'created_at' => $currentTime,
                'updated_at' => $currentTime,
            ],
            [
                'customer_id' => 1,
                'category_id' => 5,
                'winning_bidder_id' => null,
                'item_name' => 'Collectible Card',
                'item_description' => 'Rare card from a limited edition set.',
                'starting_bid' => 200.00,
                'bid_increment' => 20.00,
                'auction_start_time' => $currentTime->copy()->addDays(3)->setTime(10, 0), // starts in 3 days
                'auction_end_time' => $currentTime->copy()->addDays(4)->setTime(10, 0),   // ends in 4 days
                'auction_actual_end_time' => null,
                'auction_status' => 'Closed',
                'approval_status' => 'pending',
                'item_country' => 'USA',
                'created_at' => $currentTime,
                'updated_at' => $currentTime,
            ],
            [
                'customer_id' => 2,
                'category_id' => 6,
                'winning_bidder_id' => null,
                'item_name' => 'Leather Sofa',
                'item_description' => 'Luxury leather sofa.',
                'starting_bid' => 1000.00,
                'bid_increment' => 50.00,
                'auction_start_time' => $currentTime->copy()->subDay()->setTime(10, 0), // Started yesterday at 10:00 AM
                'auction_end_time' => $currentTime->copy()->addMinutes(15), // Ends in 5 minutes
                'auction_actual_end_time' => null,
                'auction_status' => 'Open',
                'approval_status' => 'approved',
                'item_country' => 'UK',
                'created_at' => $currentTime,
                'updated_at' => $currentTime,
            ],
        ];
        DB::table('auctions')->insert($auctions);
        DB::table('images')->insert([
            ['auction_id' => 1, 'path' => 'smartphone_image1.jpg', 'created_at' => $currentTime, 'updated_at' => $currentTime],
            ['auction_id' => 1, 'path' => 'smartphone_image2.jpg', 'created_at' => $currentTime, 'updated_at' => $currentTime],
            ['auction_id' => 2, 'path' => 'diamond_ring_image1.jpg', 'created_at' => $currentTime, 'updated_at' => $currentTime],
            ['auction_id' => 2, 'path' => 'diamond_ring_image2.jpg', 'created_at' => $currentTime, 'updated_at' => $currentTime],
            ['auction_id' => 3, 'path' => 'painting_image1.jpg', 'created_at' => $currentTime, 'updated_at' => $currentTime],
            ['auction_id' => 3, 'path' => 'painting_image2.jpg', 'created_at' => $currentTime, 'updated_at' => $currentTime],
            ['auction_id' => 4, 'path' => 'sportscar_image1.jpg', 'created_at' => $currentTime, 'updated_at' => $currentTime],
            ['auction_id' => 4, 'path' => 'sportscar_image2.jpg', 'created_at' => $currentTime, 'updated_at' => $currentTime],
            ['auction_id' => 5, 'path' => 'collectible_card_image1.jpg', 'created_at' => $currentTime, 'updated_at' => $currentTime],
            ['auction_id' => 5, 'path' => 'collectible_card_image2.jpg', 'created_at' => $currentTime, 'updated_at' => $currentTime],
            ['auction_id' => 6, 'path' => 'leather_sofa_image1.jpg', 'created_at' => $currentTime, 'updated_at' => $currentTime],
            ['auction_id' => 6, 'path' => 'leather_sofa_image2.jpg', 'created_at' => $currentTime, 'updated_at' => $currentTime],
        ]);

        DB::table('bids')->insert([
            [
            'bid_amount'=> 1000,
            'bid_time'=> $currentTime->copy()->subDays(4)->setTime(9, 0),
            'customer_id'=> 2,
            'auction_id'=> 1,
            'created_at' => now(),
            'updated_at' => now()
            ],
            [
            'bid_amount'=> 1600,
            'bid_time'=> $currentTime->copy()->subDay()->setTime(11, 0),
            'customer_id'=> 2,
            'auction_id'=> 3,
            'created_at' => now(),
            'updated_at' => now()
            ],
        ]);
    }
}
