<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;



/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Auction>
 */
class AuctionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'customer_id' => Customer::factory(),
            // 'category_id' => Category::factory(),
            // 'winning_bidder_id' => null, // No winner yet
            // 'item_name' => $this->faker->words(3, true),
            // 'item_description' => $this->faker->paragraph,
            // 'starting_bid' => $this->faker->randomFloat(2, 100, 1000), // Random starting bid between 100 and 1000
            // 'bid_increment' => $this->faker->randomFloat(2, 10, 100),  // Random bid increment between 10 and 100
            // 'auction_start_time' => now(),
            // 'auction_end_time' => now()->addDays(7),
            // 'auction_actual_end_time' => now()->addDays(7),
            // 'auction_status' => 'Open',
            // 'item_country' => $this->faker->country,

            'customer_id' => 1, // Replace with actual customer ID
            'category_id' => 1, // Replace with actual category ID
            'winning_bidder_id' => null,
            'item_name' => 'Antique Vase',
            'item_description' => 'A beautiful antique vase from the 19th century.',
            'starting_bid' => 100.00,
            'bid_increment' => 10.00,
            'auction_start_time' =>  Carbon::now()->addDays(2),
            'auction_end_time' => Carbon::now()->addDays(7),
            'auction_actual_end_time' => null,
            'auction_status' => 'Open',
            'approval_status' => 'pending',
            'item_country' => 'Egypt',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
