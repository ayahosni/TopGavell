<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class NewCommentNotification extends Notification
{
    use Queueable;

    protected $auction;
    protected $comment;

    public function __construct($auction, $comment)
    {
        $this->auction = $auction;
        $this->comment = $comment;
    }

    /**
     * Determine which channels the notification should be delivered on.
     *
     * @return array<string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail']; 
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            "auction_id"=>$this->auction->id,
            "item"=>$this->auction->item_name,
            "message"=>$this->comment->user->name ."commented on this auction",
            "content"=>$this->comment->comment_text
        ];
    }
    /**

    * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Comment on Your Auction: ' . $this->auction->item_name)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line($this->comment->user->name . ' commented on your auction: ' . $this->auction->item_name)
            ->line('Comment: ' . $this->comment->comment_text)
            ->action('View Auction', url('/auctions/' . $this->auction->id))
            ->line('Thank you for using our auction platform!');
    }
}
