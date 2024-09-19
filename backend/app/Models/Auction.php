<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Auction extends Model
{
    use HasFactory;



    protected $fillable = [
        'customer_id',
        'category_id',
        'item_name',
        'item_description',
        'starting_bid',
        'bid_increment',
        'auction_start_time',
        'auction_end_time',
        'item_media',
        'item_country',
    ];


    public function comments()
    {
        
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function Category(){
        return $this->belongsTo(Category::class);
    }

    public function bids()
    {
        return $this->hasMany(Bid::class);
    }
}
