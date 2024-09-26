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
use App\Notifications\NewBidNotification;
use Illuminate\Support\Facades\Notification;

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

  

  public function store(Request $request, $auctionId)
  {
      // Fetch the auction or throw a 404 error if not found
      $auction = Auction::findOrFail($auctionId);
  
      // Check if the auction is closed
      if ($auction->auction_status === "Closed") {
          return response()->json([
              "message" => "You can no longer participate in this auction. This auction has ended.",
          ], 400);
      }
  
      // Get the starting bid and bid increment details
      $startingBid = $auction->starting_bid;
      $bidIncrement = $auction->bid_increment;
  
      // Get the current highest bid on the auction, if available
      $currentMaxBid = Bid::where('auction_id', $auction->id)->max('bid_amount') ?? null;
  
      // Determine the minimum bid amount required
      $minBidAmount = $currentMaxBid ? $currentMaxBid + $bidIncrement : $startingBid;
  
      // Validate the bid amount to ensure it's at least the minimum required
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
  
      // Return validation error messages if the validation fails
      if ($validation->fails()) {
          return response()->json($validation->messages(), 400);
      }
  
      // Get the authenticated customer's ID
      $customer = Customer::where('user_id', Auth::id())->first();
      if (!$customer) {
          return response()->json(['error' => 'Customer not found.'], 404);
      }
  
      // Create the new bid
      $data = $request->all();
      $data['customer_id'] = $customer->id;
      $data['auction_id'] = $auction->id;
      $bid = Bid::create($data);
  
      // Notify all previous bidders about the new bid
      $previousBidders = Bid::where('auction_id', $auction->id)
                            ->where('customer_id', '!=', $customer->id) // Exclude the current bidder
                            ->with('customer.user') // Ensure the customer relationship is loaded with user
                            ->get()
                            ->pluck('customer.user');
  
      if ($previousBidders->isNotEmpty()) {
          Notification::send($previousBidders, new NewBidNotification($auction, $bid));
      }
  
      // Notify the auction owner if they exist
      $owner = $auction->customer->user ?? null; // Get the auction owner's user
      if ($owner) {
          $owner->notify(new NewBidNotification($auction, $bid));
      } else {
          return response()->json(['error' => 'Auction owner not found.'], 404);
      }
  
      // Return success response
      return response()->json([
          'message' => 'Your bid has been added successfully.',
          'auction' => new AuctionResource($auction),
      ], 200);
  }
  

}
