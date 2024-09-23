<?php

use App\Http\Controllers\API\AuctionController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\BidController;
use Illuminate\Support\Facades\Route;


Route::post('/register', [UserController::class, 'register'])->name('register');
route::get('/login', [UserController::class, 'notLoggedIn'])->name('login');
route::post('/login', [UserController::class, 'login'])->name('login');


Route::apiresource('auction', AuctionController::class);
route::middleware('auth:sanctum')->group(function () {
  
  route::get('/logout', [UserController::class, 'logout'])->name('logout');
  Route::apiResource('user', UserController::class);
  

  // route::get('/bidsOfAuction/{auc}', [BidController::class, 'bidsOfAuction'])->name('bidsOfAucction');
  
  Route::apiResource('{auction}/bid', BidController::class);
});


