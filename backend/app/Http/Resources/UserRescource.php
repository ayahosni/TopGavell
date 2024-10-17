<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserRescource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);
        return [
            "id" => $this->id,
            "name" => $this->name,
            "email" => $this->email,
            "is_email_verified" => $this->is_email_verified,
            // "phone_number"=>$this->phone_number,
            "profile_picture" => $this->profile_picture,
            // "address"=>$this->customer->address,
            "role" => $this->role,
            "banned" => $this->banned,
        ];
    }
}
