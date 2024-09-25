<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

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
            'comment_id' => $this->comment->id,
            'message' => 'A new comment has been added to your auction.',
        ];
    }
}
