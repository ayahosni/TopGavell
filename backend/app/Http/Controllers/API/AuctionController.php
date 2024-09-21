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
    //  public function __construct() {
    //     $this->middleware("auth:sanctum")->only("store","update","destroy");
    // }
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
                'item_media' => ['nullable','file'],
                'item_country' => ['required','string'],
            ]);
            if ($validation->fails()) {
                        return response()->json($validation->messages(), 400);
                    }else{ 
                        $data['item_media']=null;
                        if ($request->hasFile('item_media')) {
                        $file = $request->file('item_media');
                        $filename = time() . '.' . $file->getClientOriginalExtension();
                        $file->move(public_path('uploads/item_media'), $filename);
                        $data['item_media']  = $filename; 
                        // $data->save();
                    }
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
                'item_media' => ['nullable','file'],
                'item_country' => ['required','string'],
        ]);
    
        if ($validation->fails()) {
            return response()->json($validation->messages(), 400);
        }
        if ($request->hasFile('item_media')) {
            $file = $request->file('item_media');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/item_media'), $filename);
            $data['item_media']  = $filename; 
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


    ////////////////////////////////////////////////////////
// public function store(Request $request)
        // {
        //     // Ensure the user is authenticated
        //     $user = auth()->user();
        
        //     if (!$user) {
        //         return response()->json(['error' => 'Unauthorized'], 401);
        //     }
        
        //     // Retrieve the customer associated with the authenticated user
        //     $customer = Customer::where('user_id', $user->id)->first();
        
        //     if (!$customer) {
        //         return response()->json(['error' => 'Customer not found for this user'], 404);
        //     }
        
        //     // Add the customer_id to the request data
        //     $data = $request->all();
        //     $data['customer_id'] = $customer->id;
        
        //     $validation = Validator::make($data, [
        //         'category_id' => ['required', 'exists:categories,id'],
        //         'item_name' => ['required', 'string', 'min:4', 'max:75'],
        //         'item_description' => ['required', 'string', 'min:15', 'max:255'],
        //         'starting_bid' => ['required', 'integer'],
        //         'bid_increment' => ['required', 'integer'],
        //         'auction_start_time' => ['required', 'date'],
        //         'auction_end_time' => ['required', 'date', 'after:auction_start_time'],
        //         'item_media' => ['nullable', 'string'],
        //         'item_country' => ['required', 'string'],
        //     ]);
        
        //     if ($validation->fails()) {
        //         return response()->json($validation->messages(), 400);
        //     }
        
        //     $auction = Auction::create($data);
        
        //     return response()->json([
        //         'message' => 'Auction added successfully',
        //         'auction' => new AuctionResource($auction)
        //     ]);
        // }


//     public function update(Request $request, Auction $auction)
// {
//     // Ensure the user is authenticated
//     $user = auth()->user();

//     if (!$user) {
//         return response()->json(['error' => 'Unauthorized'], 401);
//     }

//     // Retrieve the customer associated with the authenticated user
//     $customer = Customer::where('user_id', $user->id)->first();

//     if (!$customer || $customer->id !== $auction->customer_id) {
//         return response()->json(['error' => 'You are not the owner of this auction'], 403);
//     }

//     $data = $request->all();

//     $validation = Validator::make($data, [
//         'category_id' => ['required', 'exists:categories,id'],
//         'item_name' => ['required', 'string', 'min:4', 'max:75'],
//         'item_description' => ['required', 'string', 'min:15', 'max:255'],
//         'starting_bid' => ['required', 'integer'],
//         'bid_increment' => ['required', 'integer'],
//         'auction_start_time' => ['required', 'date'],
//         'auction_end_time' => ['required', 'date', 'after:auction_start_time'],
//         'item_media' => ['nullable', 'string'],
//         'item_country' => ['required', 'string'],
//     ]);

//     if ($validation->fails()) {
//         return response()->json($validation->messages(), 400);
//     }

//     $auction->update($data);

//     return response()->json([
//         'message' => 'Auction updated successfully',
//         'auction' => new AuctionResource($auction)
//     ]);
// }

// public function destroy(Auction $auction)
// {
//     // Ensure the user is authenticated
//     $user = auth()->user();

//     if (!$user) {
//         return response()->json(['error' => 'Unauthorized'], 401);
//     }

//     // Retrieve the customer associated with the authenticated user
//     $customer = Customer::where('user_id', $user->id)->first();

//     if (!$customer || $customer->id !== $auction->customer_id) {
//         return response()->json(['error' => 'You are not the owner of this auction'], 403);
//     }

//     $auction->delete();

//     return response()->json([
//         'message' => 'Auction deleted successfully'
//     ]);
// }
}
