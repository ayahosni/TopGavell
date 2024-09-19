<?php

use App\Http\Controllers\API\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');



// Route::apiResource('/user',UserController::class);

Route::post('/register', [UserController::class, 'register'])->name('register');
route::post('/login', [UserController::class, 'login'])->name('login');
route::get('/logout', [UserController::class, 'logout'])->name('logout');

Route::resource('auctions', 'App\Http\Controllers\API\AuctionController');