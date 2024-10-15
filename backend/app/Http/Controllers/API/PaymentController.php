<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Auction;
use App\Models\Bid;
use App\Models\Customer;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class PaymentController extends Controller
{
    public function createCheckoutSession(Request $request)
    {
        $data = $request->all();
        $auctionID = $data['auction_id'];

        $bidder = Customer::where('user_id', Auth::id())->first();

        $auction = Auction::findOrFail($auctionID);
        Stripe::setApiKey(env('STRIPE_SECRET'));
        $winnerId = null;
        $Totalprice = null;

        if ($auction->winningBidder) {
            $winnerId = $auction->winningBidder->user->id;
        }
        $currentTime = Carbon::now('UTC')->setTimezone('Europe/Bucharest')->format('Y-m-d H:i:s');

        if ($winnerId === Auth::id() && $currentTime > $auction->auction_end_time) {
            $Totalprice = Bid::where('auction_id', $auction->id)->max('bid_amount');
            $paymentType = 'Complete Payment Process';
            $amount = $Totalprice - $auction->starting_bid;
        } else {
            $paymentType = 'Auction Insurance';
            $amount = $auction->starting_bid;
        }
        

        $amount = $amount * 100;
        // Create a new checkout session
        $session = Session::create(
            [
                'payment_method_types' => ['card'],
                'line_items' => [
                    [
                        'price_data' => [
                            'currency' => 'usd',
                            'product_data' => [
                                'name' => $paymentType,
                            ],
                            'unit_amount' => $amount,
                        ],
                        'quantity' => 1,
                    ],
                ],
                'mode' => 'payment',
                'success_url' => route('success', ['auctionID' => $auctionID, 'bidderID' => $bidder->id]) . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('cancel'),
            ]
        );

        return response()->json(['id' => $session->id]);
    }
    public function success($auctionID, $bidderID)
    {

        $auction = Auction::findOrFail($auctionID);

        $Totalprice = null;

        $currentTime = Carbon::now('UTC')->setTimezone('Europe/Bucharest')->format('Y-m-d H:i:s');

        if ($currentTime > $auction->auction_end_time) {
            $Totalprice = Bid::where('auction_id', $auction->id)->max('bid_amount');
            $paymentType = 'full';
            $amount = $Totalprice - $auction->starting_bid;
        } else {
            $paymentType = 'insurance';
            $amount = $auction->starting_bid;
        }


        // Get the latest Stripe session
        Stripe::setApiKey(env('STRIPE_SECRET'));
        $session_id = request('session_id'); 
        // return response()->json(['data' => $session_id]);
        $stripe = new \Stripe\StripeClient(env('STRIPE_SECRET'));
        $session = \Stripe\Checkout\Session::retrieve($session_id);
        $paymentIntentId = $session->payment_intent; // Get the payment intent ID




        // Store the payment in your database
        $data = [
            "amount" => $amount,
            "auction_id" => $auctionID,
            'bidder_id' => $bidderID,
            'type' => $paymentType,
            'payment_intent_id' => $paymentIntentId, // Save payment intent ID for future reference
        ];


        // return response()->json(['data' => $data]);

        Payment::create($data);
        return redirect('http://localhost:4200/auction/' . $auctionID);
    }

    public function checkPayment(Request $request)
    {
        $request->validate([
            'auction_id' => 'required|exists:auctions,id',
        ]);

        $bidder = Customer::where('user_id', Auth::id())->first();
        $payment = Payment::where('bidder_id', $bidder->id)->where('auction_id', $request->auction_id)->latest()->first();

        if ($payment) {
            $paymentExists = true;
        } else {
            $paymentExists = false;
        }

        return response()->json([
            'hasPaid' => $paymentExists,
            'payment_type' => $payment->type
        ]);
    }

    public function refund (Request $request)
    {

        $data=$request->all();
        $auctionID = $data['auction_id'];

        $auction = Auction::findOrFail($auctionID);

        if (Auth::user()->role === 'admin') {

            $currentTime = Carbon::now('UTC')->setTimezone('Africa/Cairo')->format('Y-m-d H:i:s');
            // Check if the time is after auction end
            if ($currentTime > $auction->auction_actual_end_time) {

                // $paymentsOfAuction = Payment::where('auction_id', $auctionID);
                $MaxPayment = Payment::where('auction_id', $auctionID)->max('amount');

                $paymentsToRefund = Payment::where('auction_id', $auctionID)
                ->where('amount', '!=', $maxPayment)
                ->get();

                $stripe = new \Stripe\StripeClient(env('STRIPE_SECRET'));


                foreach ($paymentsToRefund as $payment) {
                
                    try {
                        // Assuming that the payment has a 'payment_intent' column which stores the Stripe PaymentIntent ID
                        $stripe->refunds->create([
                            'payment_intent' => $payment->payment_intent,
                        ]);
                    
                    } catch (\Exception $e) {
                        $refundErrors[] = [
                            'bidder_id' => $payment->bidder_id,
                            'auction_id' => $payment->auction_id,
                            'payment_intent_id' => $payment->payment_intent,
                            'error_message' => $e->getMessage(),
                        ];
                    }
                
                }

                 // If there are refund errors, return them
                if (!empty($refundErrors)) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Some refunds failed',
                        'refund_errors' => $refundErrors
                    ], 400); // Bad request status
                }
            } 

            return response()->json([
                'message' => 'Unauthorized.'
              ], 403);

        }
        
        return response()->json([
            'message' => 'auction not ended yet.'
          ], 403);


        // $stripe = new Stripe();
        // $stripe = Stripe::make(env('STRIPE_SECRET'));
        // $stripe =  Stripe::setApiKey(env('STRIPE_SECRET'));
        // $stripe = new StripeClient('sk_test_51Q3Y1YApxqx10PD5EjHXihoyRwFROlVjObFqB0WCjzjvyY3zGCaHnPwJoxoWS3vLGNqWDugWnXBC5FJhE3uHjkTV00NX2b8B3J');



        // $stripe = new \Stripe\StripeClient(env('STRIPE_SECRET'));
        // $stripe->refunds->create(['payment_intent' => 'pi_3Q9WPEApxqx10PD51Np3B3Ub']);


    }
}
