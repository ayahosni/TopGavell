<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerRescource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->user->id,
            "name" => $this->user->name,
            "email" => $this->user->email,
            'phone_number' => $this->phone_number,
            'address' => $this->address
        ];
    }
}
