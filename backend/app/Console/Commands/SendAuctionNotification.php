<?php
use Illuminate\Console\Command;
use App\Models\Auction;
use App\Models\User;
use Carbon\Carbon;
use App\Notifications\AuctionStartNotification;
use App\Notifications\AuctionEndNotification;

class SendAuctionNotification extends Command
{
    protected $signature = 'auction:notify';
    protected $description = 'Send auction start and end notifications';

    public function handle()
    {
        $now = Carbon::now();

        // Auctions starting now
        $startingAuctions = Auction::where('auction_start_time', $now->toDateTimeString())->get();
        foreach ($startingAuctions as $auction) {
            // Notify the auction owner
            $owner = $auction->customer->user;
            $owner->notify(new AuctionStartNotification($auction));

            // Notify all admins
            $admins = User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                $admin->notify(new AuctionStartNotification($auction));
            }
        }

        // Auctions ending now
        $endingAuctions = Auction::where('auction_end_time', $now->toDateTimeString())->get();
        foreach ($endingAuctions as $auction) {
            // Notify the auction owner
            $owner = $auction->customer->user;
            $owner->notify(new AuctionEndNotification($auction));

            // Notify all admins
            $admins = User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                $admin->notify(new AuctionEndNotification($auction));
            }
        }
    }
}
