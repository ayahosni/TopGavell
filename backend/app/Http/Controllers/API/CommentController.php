<?php


namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Auction;
use Illuminate\Http\Request;
use App\Http\Resources\CommentResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    public function __construct() {
        $this->middleware('auth:sanctum')->only('store','update','destroy');
    }
    public function index($auctionid)
    {
        $auction = Auction::findOrFail($auctionid);
        $comments = $auction->comments()->get();
        return response()->json([
            'comments' => CommentResource::collection($comments)
        ], 200);
    }

///////////////////////////////////////////////////////////////////////////////////////////////////

    public function store(Request $request, $auctionid)
    {
        $validation = Validator::make($request->all(), [
            'comment_text' => 'required|string|min:3|max:255'
        ]);
        if ($validation->fails()) {
            return response()->json($validation->messages(), 400);
        }
        $auction = Auction::findOrFail($auctionid);
        $comment = $auction->comments()->create([
            'comment_text' => $request->comment_text,
            'auction_id' => $auctionid,
            'user_id' => Auth::id()
        ]);
        return response()->json([
            'comment' => new CommentResource($comment)
        ], 200);
    }

///////////////////////////////////////////////////////////////////////////////////////////////////

    public function update(Request $request, $auctionid, $commentId)
    {
        $validation = Validator::make($request->all(), [
            'comment_text' => 'required|string|min:3|max:255'
        ]);
        if ($validation->fails()) {
            return response()->json($validation->messages(), 400);
        }
        $comment = Comment::findOrFail($commentId);
        if ($comment->user_id != Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $comment->comment_text = $request->comment_text;
        $comment->save();
        return response()->json([
            'message' => 'Comment updated successfully',
            'comment' => new CommentResource($comment)
        ], 200);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////

    public function destroy($auctionid, $commentId)
    {
        $comment = Comment::findOrFail($commentId);
        if ($comment->user_id !== Auth::id() || Auth::user()->role === 'admin') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $comment->delete();
        return response()->json([
            'message' => 'Comment deleted successfully'
        ], 200);
    }
}
