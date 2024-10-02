<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Stripe\Checkout\Session;

use Stripe\Stripe;
use Stripe\PaymentIntent;

use App\Models\Auction;
use App\Models\Customer;
use App\Models\Payment;
use App\Models\Bid;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    //
    public function index()
    {
        return view('PaymIndex');
    }
    public function checkout($auctionID){

        // check if the customer is bidding for the first time or not for the Insurance payment 
        // $isFound=Bid::where('auction_id', $auction->id)->find($customer->id);
        // if(!$isFound){
        //     // return route('checkout', ['auctionID' => $auction->id, 'bidderID' => $customer->id]);
        //     return route('checkout', ['auctionID' => $auction->id, 'bidderID' => $customer->id]);
        // }
        $bidderID = Auth::id();
        $auction = Auction::findOrFail($auctionID);
        Stripe::setApiKey(env('STRIPE_SECRET'));

        // dd($auction);

        $amount = $auction->starting_bid;
        $item_name = $auction->item_name;

        if($auction->auction_status == "Closed") {
            $amount = Bid::where('auction_id', $auction->id)->max('bid_amount');
        }

        // dd(Bid::where('auction_id', $auction->id)->find($bidderID));
        // dd(Bid::where('auction_id', $auction->id)->where('customer_id', $bidderID)->get());


        $session = Session::create([
            'line_items'  => [
                [
                    'price_data' => [
                        'currency'     => 'USD',
                        'product_data' => [
                            'name' => $item_name,
                        ],
                        'unit_amount'  => $amount+0,
                    ],
                    'quantity'   => 1,
                ],
            ],
            'mode'        => 'payment',
            'success_url' => route('success',['auctionID' => $auctionID]),
            'cancel_url'  => route('index'),
        ]);

        return response()->json([
            'gateway link' => $session->url
        ], 400);

        return redirect()->away($session->url);


        // Stripe::setApiKey(env('STRIPE_SECRET'));

        // Create a PaymentIntent with the order amount and currency
        // $paymentIntent = PaymentIntent::create([
        //     'amount' => 1000,  // Example amount in cents (1000 = $10)
        //     'currency' => 'usd',
        //     'payment_method_types' => ['card'],  // Specify card payments
        // ]);

        // return response()->json([
        //     'clientSecret' => $paymentIntent->client_secret,
        // ]);
    }

    public function success($auctionID)
    {

        $auction = Auction::findOrFail($auctionID);
        $amount =$auction->starting_bid;

        //if pay for winneng
        if($auction->auction_status == "Closed") {
            $amount = Bid::where('auction_id', $auction->id)->max('bid_amount');
        }

        $data=[
            "amount" => $amount,
            "auction_id" => $auctionID
        ];

        Payment::create($data);

        return view('PaymIndex');
    }
}