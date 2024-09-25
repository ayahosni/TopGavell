<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\AuctionController;
use App\Http\Controllers\API\BidController;
use App\Http\Controllers\API\CommentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Http\Controllers\API\NotificationController;


Route::post('/register', [UserController::class, 'register'])->name('register');
route::get('/login', [UserController::class, 'notLoggedIn'])->name('login');
route::post('/login', [UserController::class, 'login'])->name('login');
route::get('/logout', [UserController::class, 'logout'])->name('logout')->middleware('auth:sanctum');

Route::apiResource('user', UserController::class);
Route::apiresource('auction', AuctionController::class);
Route::apiResource('{auction}/bids', BidController::class);
Route::apiResource('{auction}/comments', CommentController::class);

Route::post('/sanctum/token',function (Request $request){
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
        'device_name' => 'required',
    ]);
 
    $user = User::where('email', $request->email)->first();
 
    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }
 
    return $user->createToken($request->device_name)->plainTextToken;
});

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/notifications', [NotificationController::class, 'index']);
    });
    