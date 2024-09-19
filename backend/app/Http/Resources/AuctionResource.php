<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuctionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [ 
            "id"=>$this->id,
             'customer' => $this->customer_id,
        'category' => $this->category_id,
        // 'customer' => $this->customer->user->name,
        // 'category' => $this->category->name,
        'item_name' => $this->item_name,
        'item_description' => $this->item_description,
        'starting_bid' => $this->starting_bid,
        'bid_increment' => $this->bid_increment,
        'auction_start_time' => $this->auction_start_time,
        'auction_end_time' => $this->auction_end_time,
        'item_media' =>$this->item_media,
        'item_country' => $this->item_country
        ];
    }
}
