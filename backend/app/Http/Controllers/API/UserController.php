<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerResource;
use App\Http\Resources\UserRescource;
use App\Mail\OtpMail;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->only(['store', 'update', 'destroy', 'profile', 'updateProfile']);
    }

    /**
     */
    public function index()
    {
        $customers = Customer::with('user')->paginate(15);
        return response()->json([
            'data' => $customers->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'user_id' => $customer->user_id,
                    'name' => $customer->user->name,  
                    'email' => $customer->user->email, 
                    'phone number'=>$customer->phone_number,
                    'address'=>$customer->address, 
                ];
            }),
            'meta' => [
                'current_page' => $customers->currentPage(),
                'last_page' => $customers->lastPage(),
                'per_page' => $customers->perPage(),
                'total' => $customers->total()
            ]
        ]);
    }
    


    /**
     */
    public function register(Request $request)
    {
        $data = $request->all();

        $validation = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/'
            ],
            'phone_number' => ['required'],
            'address' => ['required'],
        ]);

        if ($validation->fails()) {
            return response()->json($validation->messages(), 400);
        }

        $otp = random_int(100000, 999999); // Generate a 6-digit OTP
        $data['password'] = Hash::make($data['password']);
        $data['OTP'] = $otp;
        $user = User::create($data);
        $data['user_id'] = $user->id;
        $cust = Customer::create($data);

        Mail::to($user->email)->send(new OtpMail($otp));

        return response()->json([
            'message' => 'Registered successfully! Please check your email to verify your account.',
            'user' => new CustomerResource($cust),
            'token' => $user->createToken('auth_token')->plainTextToken,
        ], 200);
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /**
     */
    public function email_verify(Request $request)
    {
        $data = $request->all();
        $validation = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp' => 'required|integer',
        ]);

        if ($validation->fails()) {
            return response()->json($validation->messages(), 400);
        }

        $user = User::where('email', $request->email)->first();
        $otp = $data['otp'];

        if ($user && $user->OTP == $otp) {
            $user->OTP = null;
            $user->is_email_verified = true;
            $user->save();
            return response()->json(['message' => 'Email verified successfully.']);
        }

        return response()->json([
            'message' => 'Invalid OTP.',
        ], 400);
    }

    /**
     */ ////////////////////////////////////////////////////////////////////////////////////////
    public function login(Request $request)
    {
        $validation = Validator::make(
            $request->all(),
            [
                'email' => 'required|email',
                'password' => 'required',
            ]
        );

        if ($validation->fails()) {
            return response()->json($validation->messages(), 400);
        }

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid Username or Password'], 400);
        }

        $userdata = null;
        if ($user->role === 'admin') {
            $userdata = new UserRescource($user);
        } else {
            $cust = Customer::where('user_id', $user->id)->first();
            $userdata = new CustomerResource($cust);
        }

        return response()->json([
            'message' => 'User successfully logged in',
            'user' => $userdata,
            'token' => $user->createToken('auth_token')->plainTextToken,
        ]);
    }

    #######################################################################################################    

    #######################################################################################################

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully'], 200);
    }

    /**
     */
    public function profile(Request $request)
    {
        $user = $request->user();  // Get the logged-in user
        $customer = Customer::where('user_id', $user->id)->first();  // Retrieve the associated customer profile

        if ($customer) {
            // Return customer resource if the user has a customer profile
            return response()->json([
                'user' => new CustomerResource($customer),
                'profile_image_url' => $user->profile_picture ? url('storage/' . $user->profile_picture) : null,
            ], 200);
        } else {
            // Return user resource if no customer profile exists
            return response()->json([
                'user' => new UserRescource($user),
                'profile_image_url' => $user->profile_picture ? url('storage/' . $user->profile_picture) : null,
            ], 200);
        }
    }

    //////////////////////////////////////////////////////////////////////////////
    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        $customer = Customer::where('user_id', $user->id)->first();

        $validation = Validator::make($request->all(), [
            'name' => ['sometimes', 'string', 'max:255'],
            'password' => [
                'sometimes',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/'
            ],
            'phone_number' => ['sometimes', 'string'],
            'address' => ['sometimes', 'string'],
        ]);

        if ($validation->fails()) {
            return response()->json($validation->messages(), 400);
        }

        if ($request->has('name')) {
            $user->name = $request->name;
        }

        if ($customer) {
            if ($request->has('phone_number')) {
                $customer->phone_number = $request->phone_number;
            }

            if ($request->has('address')) {
                $customer->address = $request->address;
            }
        }

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        // Save the updated user
        // $user->save();

        // Save the updated customer profile if it exists
        if ($customer) {
            $customer->save();
        }

        // Return a response with the updated user and customer data

        if ($user->role == "admin") {
            return response()->json([
                'message' => 'Profile updated successfully!',
                'user' => $user,
            ], 200);
        }
        return response()->json([
            'message' => 'Profile updated successfully!',
            'user' => $user,
            'customer' => $customer,
        ], 200);
    }





    /**
     */
    public function show(User $user)
    {
        return new UserRescource($user);
    }

    /**
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     */
    public function destroy(User $user)
    {
        //
    }
}
