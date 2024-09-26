<?php
namespace App\Observers;
use App\Models\Bid; 
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

        // Check for the last bid made
        $lastBid = Bid::where('auction_id', $auction->id)
            ->orderBy('created_at', 'desc')
            ->first();

          // If a last bid exists and it was made within the last 2 minutes of the auction
        //   if ($lastBid && $lastBid->created_at >= $auction->auction_end_time->copy()->subMinutes(2)) {
        //     // Delay the auction end time by 2 minutes
        //     $auction->auction_end_time = $auction->auction_end_time->addMinutes(2);
        
        // }
    }
}
