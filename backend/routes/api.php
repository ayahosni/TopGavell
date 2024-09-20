<?php

use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\BidController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');



// Route::apiResource('/user',UserController::class);

Route::post('/register', [UserController::class, 'register'])->name('register');
route::post('/login', [UserController::class, 'login'])->name('login');
route::get('/logout', [UserController::class, 'logout'])->name('logout');



// Route::resource('bid', 'App\Http\Controllers\API\BidController');
Route::apiResource("/bid", BidController::class);
route::get('/bidsOfAuction', [BidController::class, 'bidsOfAuction'])->name('bidsOfAucction');


// GET|HEAD        api/bid ....................................... bid.index › API\BidController@index
// POST            api/bid ....................................... bid.store › API\BidController@store
// GET|HEAD        api/bid/{bid} ................................... bid.show › API\BidController@show
// PUT|PATCH       api/bid/{bid} ............................... bid.update › API\BidController@update
// DELETE          api/bid/{bid} ............................. bid.destroy › API\BidController@destroy
// GET|HEAD        api/bidsOfAuction ................ bidsOfAucction › API\BidController@bidsOfAuction
