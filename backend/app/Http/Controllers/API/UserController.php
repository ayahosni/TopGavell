<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerRescource;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return CustomerRescource::collection(Customer::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    
    public function register(Request $request)
    {
        $data = $request->all();

        $validation = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'phone_number' => ['required'],
            'address' => ['required'],
        ]);
        if ($validation->fails()) {
            return response()->json($validation->messages(), 400);
        }

        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);
        $data['user_id'] = $user->id;
        $cust = Customer::create($data);

        return response()->json([
            'message' => 'User successfully registered',
            'user' => new CustomerRescource($cust),
            'token' => $user->createToken('auth_token')->plainTextToken,
        ], 201);
    }

    #######################################################################################################    

    public function login(Request $request)
    {
        $validation = Validator::make(
            $request->all(),
            [
                'email' => 'required|email',
                'password' => 'required',
                // 'device_name' => 'required',
            ]
        );
        if ($validation->fails()) {
            return response()->json($validation->messages(), 400);
        }
        $user = User::where('email', $request->email)->first();
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
        $cust = Customer::where('user_id', $user->id)->first();
        return response()->json([
            'message' => 'User successfully logged in',
            'user' => new CustomerRescource($cust),
            'token' => $user->createToken('auth_token')->plainTextToken,
        ]);
    }

    #######################################################################################################

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Successfully logged out',
        ]);
    }
    /**
     * Display the specified resource.
     */
    public function notLoggedIn(User $user)
    {
        return response()->json([
            'message' => 'Please Login First',
        ]);
    }

    public function show(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
