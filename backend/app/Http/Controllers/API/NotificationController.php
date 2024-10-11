<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Bid;
use App\Models\Comment;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user()->unreadNotifications;

        // Assuming 'data' is the key containing the notification data
        $notificationData = $notifications->map(function ($notification) {
            return [
                'id' => $notification->id,
                'data' => $notification->data,
                'created_at' => $notification->created_at,
            ];
        });
    
        return response()->json($notificationData);
    }    
}