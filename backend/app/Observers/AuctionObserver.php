<?php
namespace App\Observers;

use App\Models\Auction;
use Carbon\Carbon;

class AuctionObserver
{
    public function saving(Auction $auction)
    {
        $currentTime = Carbon::now();

        // Update auction status before saving
        if ($auction->auction_start_time <= $currentTime && $auction->auction_end_time > $currentTime) {
            $auction->auction_status = 'Open';
        } elseif ($auction->auction_end_time <= $currentTime) {
            $auction->auction_status = 'Closed';
        }
    }
}
