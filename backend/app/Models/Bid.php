<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bid extends Model
{
    use HasFactory;

    protected $fillable = [
        'bid_amount',
        'customer_id',
        'auction_id',
    ];
    
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function auction()
    {
        return $this->belongsTo(Auction::class);
    }
}
