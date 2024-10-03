<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\AuctionController;
use App\Http\Controllers\API\BidController;
use App\Http\Controllers\API\CommentController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\PaymentController;

Route::post('/register', [UserController::class, 'register'])->name('register');
Route::post('email_verify', [UserController::class,'email_verify'])->name('email_verify');
route::get('/login', [UserController::class, 'notLoggedIn'])->name('login');
route::post('/login', [UserController::class, 'login'])->name('login');
route::get('/logout', [UserController::class, 'logout'])->name('logout')->middleware('auth:sanctum');

Route::apiResource('user', UserController::class);

Route::apiresource('auction', AuctionController::class);
Route::get('/active-auctions', [AuctionController::class, 'showActiveAuctions']);
// Route::get('/auction-status', [AuctionController::class, 'updateAuctionStatus']);
Route::get('/auctions/search-by-category', [AuctionController::class, 'searchByCategory']);

Route::apiResource('{auction}/bids', BidController::class);
Route::apiResource('{auction}/comments', CommentController::class);
Route::get('/notifications', [NotificationController::class, 'index'])->middleware('auth:sanctum');

// Route::get('/checkout', [PaymentController::class, 'index'])->name('index');
// Route::post('/checkout/{auctionID}/{bidderID}', [PaymentController::class, 'checkout'])->name('checkout');
// Route::get('/success/{auctionID}/{bidderID}', [PaymentController::class, 'success'])->name('success');


Route::post('/create-checkout-session', [PaymentController::class, 'createCheckoutSession'])->name('createSession')->middleware('auth:sanctum');
Route::get('/success/{auctionID}/{bidderID}', [PaymentController::class, 'success'])->name('success');

Route::get('/cancel', function () {
  return 'Payment Cancelled';
})->name('cancel');
