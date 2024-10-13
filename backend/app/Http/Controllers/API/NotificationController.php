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
    $notifications = $request->user()->notifications()
    ->paginate($request->per_page);

    $notificationData = $notifications->map(function ($notification) {
      return [
        'id' => $notification->id,
        'data' => $notification->data,
        'created_at' => $notification->created_at,
      ];
    });

    // Return a paginated JSON response
    return response()->json([
      'data' => $notificationData,
      'meta' => [
        'current_page' => $notifications->currentPage(),
        'last_page' => $notifications->lastPage(),
        'per_page' => $notifications->perPage(),
        'total' => $notifications->total(),
      ]
    ]);
  }
}
