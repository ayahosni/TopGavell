<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Auction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\AuctionResource;
use App\Models\Customer;
use App\Models\Image;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\User;

use App\Notifications\NewAuctionNotification;
use Illuminate\Support\Facades\Notification;

class AuctionController extends Controller
{
  public function __construct()
  {
    $this->middleware('auth:sanctum')->only('store', 'update', 'destroy','pendingAuctions');
  }
  // public function index()
  // {
  //   return AuctionResource::collection(Auction::all());
  // }
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// show all approved auctions
  public function index()
{
    $approvedAuctions = Auction::where('approval_status', 'approved')->get();
    return AuctionResource::collection($approvedAuctions);
}

  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  public function pendingAuctions()
{
  if (Auth::user()->role === 'admin') {

    $pendingAuctions = Auction::where('approval_status', 'pending')->get();

    return AuctionResource::collection($pendingAuctions);
}
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

  public function show(Auction $auction)
  {
    return new AuctionResource($auction);
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  //show active auction

  public function showActiveAuctions()
  {
    $currentTime = Carbon::now();

    // Query to get auctions where current time is within the auction start and end times
    $activeAuctions = Auction::where('auction_start_time', '<=', $currentTime)
      ->where('auction_end_time', '>=', $currentTime)
      ->get();

    return AuctionResource::collection($activeAuctions);
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  

  public function store(Request $request)
  {
    if (Auth::user()->role === 'admin') {
      return response()->json([
        'message' => 'Admin cannot create an auction.'
      ], 403);
    }
    if (Auth::user()->is_email_verified === 0) {
      return response()->json([
        'message' => 'Please verify your mail first.'
      ], 403);
    }
    $data = $request->all();

    $validation = Validator::make($request->all(), [
      'category_id' => ['required', 'exists:categories,id'],
      'item_name' => ['required', 'string', 'min:4', 'max:75'],
      'item_description' => ['required', 'string', 'min:15', 'max:255'],
      'starting_bid' => ['required', 'integer'],
      'bid_increment' => ['required', 'integer'],
      'auction_start_time' => ['required', 'date', 'after:now'],
      'auction_end_time' => ['required', 'date'],
      'item_country' => ['required', 'string'],
      'item_media.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    if ($validation->fails()) {
      return response()->json($validation->messages(), 400);
    }
    $customer = Customer::where('user_id', Auth::id())->first();
    $data['customer_id'] = $customer->id;
    $data['auction_actual_end_time'] = $data['auction_end_time'];

    // if ($request->hasFile('item_media')) {
    //   $file = $request->file('item_media');
    //   $filename = time() . '.' . $file->getClientOriginalExtension();
    //   $file->move(public_path('uploads/item_media'), $filename);
    //   $data['item_media'] = $filename;
    // }

    $auction = Auction::create($data);
    if ($request->hasFile('item_media')) {
      foreach ($request->file('item_media') as $image) {
        $filename = uniqid(time() . '_') . '.' . $image->getClientOriginalExtension();
        $image->move(public_path('uploads/images'), $filename);
        $path = 'images/'.$filename;
        Image::create(['auction_id' => $auction->id, 'path' => $path]);
      }
    }

    // Get all admin users
    $admins = User::where('role', 'admin')->get();

    // Send notification to all admin users
    if ($admins->isNotEmpty()) {
      Notification::send($admins, new NewAuctionNotification($auction));
    }

    return response()->json([
      'message' => 'Auction Created successfully',
      'auction' => new AuctionResource($auction)
    ], 200);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  public function update(Request $request, Auction $auction)
  {
    if (Auth::id() !== $auction->user_id) {
      return response()->json(['message' => 'Unauthorized'], 403);
    }
          
    // Check if the time is before auction start
    if ($currentTime < $auction->auction_start_time){

    $data = $request->all();

    $validation = Validator::make($request->all(), [
      'category_id' => ['required', 'exists:categories,id'],
      'item_name' => ['required', 'string', 'min:4', 'max:75'],
      'item_description' => ['required', 'string', 'min:15', 'max:255'],
      'starting_bid' => ['required', 'decimal:10,2'],
      'bid_increment' => ['required', 'decimal:10,2'],
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
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Auction $auction)
  {

    $user = Auth::user();

          // Check if the time is before auction start
    if ($currentTime < $auction->auction_start_time){
          // Check if the user is either the owner of the auction or an admin
      if ($user->role === 'admin' || $user->id === $auction->customer->user_id) {
      $auction->delete();

      return response()->json([
        'message' => 'Auction deleted successfully'
      ], 200);
    }
    }
    
    return response()->json([
      'message' => 'Unauthorized.'
    ], 403);
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  public function searchByCategory(Request $request)
  {
    $categoryId = $request->input('category_id');

    $validation = Validator::make($request->all(), [
      'category_id' => ['required', 'exists:categories,id'],
    ]);

    if ($validation->fails()) {
      return response()->json($validation->messages(), 400);
    }

    $auctions = Auction::where('category_id', $categoryId)->get();

    return AuctionResource::collection($auctions);
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

  public function approve($id)
    {
      $user = Auth::user();

      // Check if the user is admin
      if ($user->role === 'admin') {

        $auction=Auction::find($id);
        $auction->approval_status = 'approved';
        $auction->save();
  
        return response()->json([
          'message' => 'Auction approved successfully'
        ], 200);
      }
      return response()->json([
        'message' => 'Unauthorized.'
      ], 403); 

        

    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////
    public function rejected($id)
    {
      // $user = Auth::user();

      // Check if the user is admin
      if ($user->role === 'admin') {

        $auction=Auction::find($id);
        $auction->approval_status = 'rejected';
        $auction->save();
  
        return response()->json([
          'message' => 'Auction rejected successfully'
        ], 200);
      }
      return response()->json([
        'message' => 'Unauthorized.'
      ], 403); 

        

    }


}
