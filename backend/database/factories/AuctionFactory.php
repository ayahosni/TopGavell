<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;


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
            //
            'customer_id' => '1',//Customer::inRandomOrder()->first()->id, // Ensure you have customers in your database
            'category_id' => '1',//Category::inRandomOrder()->first()->id, // Ensure you have categories in your database
            'item_name' => $this->faker->words(3, true),
            'item_description' => $this->faker->paragraph,
            'starting_bid' => $this->faker->randomFloat(2, 100, 1000), // Random starting bid between 100 and 1000
            'bid_increment' => $this->faker->randomFloat(2, 10, 100),  // Random bid increment between 10 and 100
            'auction_start_time' => now(),
            'auction_end_time' => now()->addDays(7),
            'auction_actual_end_time' => now()->addDays(8),
            'auction_status' => 'Closed', // Default value
            'item_media' => $this->faker->imageUrl(), // Random image URL
            'item_country' => $this->faker->country,
        ];
    }
}
