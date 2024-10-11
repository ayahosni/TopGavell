<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Models\Auction;
use App\Models\Bid;
use App\Models\Customer;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class PaymentController extends Controller
{
    public function createCheckoutSession(Request $request)
    {   
        $data=$request->all();
        $auctionID = $data['auction_id'];
        
        $bidder=Customer::where('user_id', Auth::id())->first();

        // return response()->json(['id' => $bidderID]);
        $auction = Auction::findOrFail($auctionID);
        Stripe::setApiKey(env('STRIPE_SECRET'));

        $item_name = $auction->item_name;

        
            $amount = Bid::where('auction_id', $auction->id)->max('bid_amount');
            if(!$amount){
                $amount = $auction->starting_bid;
            }
        
        $amount = $amount*100;
        // Create a new checkout session
        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [
                [
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => 'Auction Insurance',
                        ],
                        'unit_amount' => $amount, // Amount in cents
                    ],
                    'quantity' => 1,
                ],
            ],
            'mode' => 'payment',
            'success_url' => route('success',['auctionID' => $auctionID,'bidderID'=> $bidder->id]),
            'cancel_url' => route('cancel'),   // URL after payment cancellation
        ]);

        return response()->json(['id' => $session->id]);
    }
    public function success($auctionID,$bidderID)
    {

        $auction = Auction::findOrFail($auctionID);
        $amount =$auction->starting_bid;


        if($auction->auction_status == "Closed") {
            $amount = Bid::where('auction_id', $auction->id)->max('bid_amount');
            if(!$amount){
                $amount = $auction->starting_bid;
            }
        }

        $data=[
            "amount" => $amount,
            "auction_id" => $auctionID,
            'bidder_id'=>$bidderID
        ];

        Payment::create($data);
        return redirect('http://localhost:4200/auction/' . $auctionID);
    }

    public function checkPayment(Request $request)
    {
        $request->validate([
            'auction_id' => 'required|exists:auctions,id',
        ]);
        $bidder=Customer::where('user_id', Auth::id())->first();
        $paymentExists = DB::table('payments')
            ->where('bidder_id', $bidder->id)
            ->where('auction_id', $request->auction_id)
            ->exists();

        return response()->json(['hasPaid' => $paymentExists]);
    }
}
