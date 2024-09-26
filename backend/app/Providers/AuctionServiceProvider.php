<?php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Log;
use App\Models\Auction;
use Carbon\Carbon;

class AuctionServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->updateAuctionStatus();
    }

    protected function updateAuctionStatus()
    {
        $currentTime = Carbon::now();

        // Update auctions that should be 'Open'
        Auction::where('auction_start_time', '<=', $currentTime)
            ->where('auction_end_time', '>', $currentTime)
            ->where('auction_status', 'Closed')
            ->update(['auction_status' => 'Open']);

        // Update auctions that should be 'Closed'
        Auction::where('auction_end_time', '<=', $currentTime)
            ->where('auction_status', 'Open')
            ->update(['auction_status' => 'Closed']);
    }
}
