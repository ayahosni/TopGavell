<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuctionResource;
use App\Models\Bid;
use App\Models\Auction;
use Illuminate\Http\Request;
use App\Http\Resources\BidResource;
use App\Models\Customer;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class BidController extends Controller
{
  public function __construct() {
    $this->middleware('auth:sanctum')->only('store','update','destroy');
  }
  
  public function index($auction)
  {
    $auction = Auction::findOrFail($auction);
    return BidResource::collection($auction->bids);
  }

  public function store(Request $request, $auction)
  {
    $auction = Auction::findOrFail($auction);
    if ($auction->auction_status === "Closed") {
      return response()->json([
        "message" => "You can no longer participate in this auction. This auction has ended",
      ], 400);
    }
    $startingBid = $auction->starting_bid;
    $bidIncrement = $auction->bid_increment;
    $currentMaxBid = Bid::where('auction_id', $auction->id)->max('bid_amount') ?? null;
    $minBidAmount = $currentMaxBid
      ? $currentMaxBid + $bidIncrement
      : $startingBid;
    $validation = Validator::make($request->all(), [
      'bid_amount' => [
        'required',
        'numeric',
        function ($attribute, $value, $fail) use ($minBidAmount) {
          if ($value < $minBidAmount) {
            $fail("The bid amount must be at least $minBidAmount.");
          }
        },
      ],
    ]);
    if ($validation->fails()) {
      return response()->json($validation->messages(), 400);
    }
    $data = $request->all();
    $customer = Customer::where('user_id', Auth::id())->first();
    $data['customer_id'] = $customer->id;
    $data['auction_id'] = $auction->id;
    Bid::create($data);
    return response()->json([
      'message' => 'Your bid is Added successfully',
      'auction' => new AuctionResource($auction)
    ], 200);
  }
}
