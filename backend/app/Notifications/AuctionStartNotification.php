<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;



class AuctionStartNotification extends Notification
{
    use Queueable;

    public $auction;

    public function __construct($auction)
    {
        $this->auction = $auction;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->subject('Auction Started')
                    ->line('The auction ' . $this->auction->title . ' has started.')
                    ->action('View Auction', url('/auctions/' . $this->auction->id));
    }

    public function toArray($notifiable)
    {
        return [
            'auction_id' => $this->auction->id,
            'message' => 'The auction ' . $this->auction->title . ' has started.'
        ];
    }
}
