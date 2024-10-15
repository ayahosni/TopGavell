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
                'success_url' => route('success', ['auctionID' => $auctionID, 'bidderID' => $bidder->id]),
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

        $data = [
            "amount" => $amount,
            "auction_id" => $auctionID,
            'bidder_id' => $bidderID,
            'type' => $paymentType
        ];

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
}
