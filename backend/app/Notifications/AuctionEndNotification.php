<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;



class AuctionEndNotification extends Notification
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
            ->subject('Auction ended')
            ->line('The auction ' . $this->auction->title . ' has ended.')
            ->action('View Auction', url('/auctions/' . $this->auction->id));
    }

    public function toArray($notifiable)
    {
        return [
            'auction_id' => $this->auction->id,
            'message' => 'The auction ' . $this->auction->title . ' has ended.'
        ];
    }
}
