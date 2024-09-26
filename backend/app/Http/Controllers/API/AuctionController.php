<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Auction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\AuctionResource;
use App\Models\Customer;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AuctionController extends Controller
{
  public function __construct() {
    $this->middleware('auth:sanctum')->only('store','update','destroy');
  }

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
      'category_id' => ['required', 'exists:categories,id'],
      'item_name' => ['required', 'string', 'min:4', 'max:75'],
      'item_description' => ['required', 'string', 'min:15', 'max:255'],
      'starting_bid' => ['required', 'decimal:10,2'],
      'bid_increment' => ['required', 'decimal:10,2'],
      'starting_bid' => ['required', 'integer'],
      'bid_increment' => ['required', 'integer'],
      'auction_start_time' => ['required', 'date', 'after:now'],
      'auction_end_time' => ['required', 'date', 'after:auction_start_time'],
      'item_media' => ['nullable', 'file'],
      'item_country' => ['required', 'string'],
    ]);
    if ($validation->fails()) {
      return response()->json($validation->messages(), 400);
    }
    $customer = Customer::where('user_id', Auth::id())->first();
    $data['customer_id'] = $customer->id;
    $data['auction_actual_end_time'] = $data['auction_end_time'];
    $data['item_media'] = null;

    if ($request->hasFile('item_media')) {
      $file = $request->file('item_media');
      $filename = time() . '.' . $file->getClientOriginalExtension();
      $file->move(public_path('uploads/item_media'), $filename);
      $data['item_media']  = $filename;
    }

    $auction = Auction::create($data);

    return response()->json([
      'message' => 'Auction Created successfully ',
      'auction' => new AuctionResource($auction)
    ],200);
  }

  public function update(Request $request, Auction $auction)
  {
    $data = $request->all();

    $validation = Validator::make($request->all(), [
      'category_id' => ['required', 'exists:categories,id'],
      'item_name' => ['required', 'string', 'min:4', 'max:75'],
      'item_description' => ['required', 'string', 'min:15', 'max:255'],
      'starting_bid' => ['required','decimal:10,2'],
      'bid_increment' => ['required','decimal:10,2'],
      'starting_bid' => ['required', 'integer'],
      'bid_increment' => ['required', 'integer'],
      'auction_start_time' => ['required', 'date'],
      'auction_end_time' => ['required', 'date', 'after:auction_start_time'],
      'item_media' => ['nullable', 'file'],
      'item_country' => ['required', 'string'],
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


public function updateAuctionStatu()
{
    $currentTime = Carbon::now();

    Auction::where('auction_start_time', '<=', $currentTime)
        ->where('auction_end_time', '>', $currentTime)
        ->where('auction_status', 'Closed')
        ->update(['auction_status' => 'Open']);

    Auction::where('auction_end_time', '<=', $currentTime)
        ->where('auction_status', 'Open')
        ->update(['auction_status' => 'Closed']);
}
}