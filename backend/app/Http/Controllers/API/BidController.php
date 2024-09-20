<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Bid;
use App\Models\Auction;
use Illuminate\Http\Request;
use App\Http\Resources\BidResource;

class BidController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return BidResource::collection(Bid::all());

    }


    public function bidsOfAuction($auction)
    {
        //
        $bids = Bid::where('auction_id','=',$auction)->get();

        return new BidResource($bids);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
//         $std_validator  = Validator::make($request->all(), [
//             'bid_amount' => 'required|number',
//             'auction_id' => 'required',
//         ],[
//             'bid_amount.required'=>'bid_amount is required.',
//             'auction_id.required'=>'auction_id is required.',
//         ]);
//         # create new validator object ??
//         if($std_validator->fails()){
// //            return "errors";
//             return response()->json([
//                 "message"=>"errors with request parameters",
//                 "errors"=> $std_validator->errors()
//             ], 400);
//         }


        // $maxBid = Bid::max('bid_amount');

        $auc=Auction::find($request->auction_id);
        $auc_starting_bid=$auc->starting_bid;
        
        $maxBid = Bid::where('auction_id', $request->auction_id)->max('bid_amount');

        $bid_amount = $request->bid_amount;  
        
        // $request->bid_time = now();

        // echo $request->bid_time;

        if ($auc->auction_status=="Open")
        {
            if($request->bid_amount > $maxBid && $request->bid_amount > $auc_starting_bid){

                $request_data = $request->all();
                $bid = Bid::create($request_data);

                return response()->json([
                    "message"=>"succes bid added ",
    
                ], 200);

            }
            else {

                return response()->json([
                    "message"=>"you shoud enter valu grater than ". $maxBid ." or ".$auc_starting_bid
                    ], 400);
            }
       
        }
        else {

            return response()->json([
                "message"=>"the auction is close",
                ], 400);
        }



    }

    /**
     * Display the specified resource.
     */
    public function show(Bid $bid)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Bid $bid)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bid $bid)
    {
        //
    }
}
