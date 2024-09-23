<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'phone_number' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
            'user_id' => User::factory([
                'role'=>'customer'
            ]),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
