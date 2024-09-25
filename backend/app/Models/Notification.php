<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 
        'auction_id', 
        'notification_type', 
        'content', 
        'time_sent', 
        'read_at', 
        'notifiable_type', 
        'notifiable_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function auction()
    {
        return $this->belongsTo(Auction::class);
    }
}
