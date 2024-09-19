<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Auction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use App\Models\Customer;
use App\Models\User;
use App\Http\Resources\AuctionResource;



class AuctionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
        public function index()
        {

            return AuctionResource::collection(Auction::all());

         }

        public function show(Auction $auction)
        {
            return new AuctionResource($auction);
        }

        public function store(Request $request)
        {

                $data = $request->all();

            $validation = Validator::make($request->all(), [
                'customer_id' => ['required','exists:customers,id'],
                'category_id' => ['required','exists:categories,id'],
                'item_name' => ['required','string','min:4','max:75'],
                'item_description' => ['required','string','min:15','max:255'],
                // 'starting_bid' => ['required','decimal:10,2'],
                // 'bid_increment' => ['required','decimal:10,2'],
                'starting_bid' => ['required','integer'],
                'bid_increment' => ['required','integer'],
                'auction_start_time' => ['required','date'],
                'auction_end_time' => ['required','date','after:auction_start_time'],
                'item_media' => ['nullable','string'],
                'item_country' => ['required','string'],
            ]);
            if ($validation->fails()) {
                        return response()->json($validation->messages(), 400);
                    }else{
            $auction = Auction::create($data);
            return response()->json([
                        'message' => 'Auction added successfully ',
                        'auction'=> new AuctionResource($auction)
                    ]);

                    }           
   
        }    


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Auction $auction)
    {
        $data = $request->all();
    
        $validation = Validator::make($request->all(), [
                'category_id' => ['required','exists:categories,id'],
                'item_name' => ['required','string','min:4','max:75'],
                'item_description' => ['required','string','min:15','max:255'],
                // 'starting_bid' => ['required','decimal:10,2'],
                // 'bid_increment' => ['required','decimal:10,2'],
                'starting_bid' => ['required','integer'],
                'bid_increment' => ['required','integer'],
                'auction_start_time' => ['required','date'],
                'auction_end_time' => ['required','date','after:auction_start_time'],
                'item_media' => ['nullable','string'],
                'item_country' => ['required','string'],
        ]);
    
        if ($validation->fails()) {
            return response()->json($validation->messages(), 400);
        }
    
        $auction->update($data);
    
        return response()->json([
            'message' => 'Auction updated successfully',
            'auction' => new AuctionResource($auction)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Auction $auction)
    {
        $auction->delete();
    
        return response()->json([
            'message' => 'Auction deleted successfully'
        ]);
    }
}
