<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UpdateAuctionNotification extends Notification
{
    use Queueable;

    protected $auction;

    public function __construct($auction)
    {
        $this->auction = $auction;
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
            'auction' => $this->auction->item_name,
            'message' => 'An auction has been updated: ' . $this->auction->item_name,
            'auction_id' => $this->auction->id,
            'user'=>$this->auction->customer->user->name 
        ];
    }
}