<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewBidNotification extends Notification
{
    use Queueable;

    protected $auction;
    protected $bid;

    public function __construct($auction, $bid)
    {
        $this->auction = $auction;
        $this->bid = $bid;
    }

    /**
     * Determine which channels the notification should be delivered on.
     *
     * @return array<string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'auction_id' => $this->auction->id,
            'bid_id' => $this->bid->id,
            'amount' => $this->bid->amount,
            'message' => 'A new bid has been placed on your auction.',
        ];
    }
}
