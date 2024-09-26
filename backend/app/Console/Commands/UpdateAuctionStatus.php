<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Auction;
use Carbon\Carbon;

class UpdateAuctionStatus extends Command
{
    protected $signature = 'auction:update-status';

    protected $description = 'Update auction status based on start and end time';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
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

        $this->info('Auction status updated successfully.');
    }
}
