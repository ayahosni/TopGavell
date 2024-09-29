<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\VerifiesEmails;
use App\Http\Requests\EmailVerificationRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Request;

class VerificationController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Email Verification Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling email verification for any
    | user that recently registered with the application. Emails may also
    | be re-sent if the user didn't receive the original email message.
    |
    */

    use VerifiesEmails;

    /**
     * Where to redirect users after verification.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('signed')->only('verify');
        $this->middleware('throttle:6,1')->only('verify', 'resend');
    }

    /**
     * Mark the authenticated user's email address as verified.
     */
    // public function verify(EmailVerificationRequest $request)
    // {
    //     $request->fulfill();  // Mark email as verified

    //     return response()->json(['message' => 'Email verified successfully.']);
    // }

    // /**
    //  * Resend the email verification notification.
    //  */
    // public function resend(Request $request)
    // {
    //     if ($request->user()->hasVerifiedEmail()) {
    //         return response()->json(['message' => 'Email already verified.'], 400);
    //     }

    //     $request->user()->sendEmailVerificationNotification();

    //     return response()->json(['message' => 'Verification email resent successfully.']);
    // }

    // public function verify(EmailVerificationRequest $request)
    // {
    //     if (!$request->validateHash()) {
    //         return response()->json(['message' => 'Invalid verification link.'], 403);
    //     }

    //     if ($request->user()->hasVerifiedEmail()) {
    //         return response()->json(['message' => 'Email already verified.'], 400);
    //     }

    //     $request->fulfill();

    //     return response()->json(['message' => 'Email verified successfully.'], 200);
    // }
    public function verify($id, $hash)
    {
        // Find the user by ID
        $user = User::findOrFail($id);

        // Check if the verification hash matches
        if (!Hash::check($user->email, $hash)) {
            return response()->json(['message' => 'Invalid verification link.'], 400);
        }

        // Mark the user's email as verified
        $user->markEmailAsVerified();

        return response()->json(['message' => 'Email verified successfully.']);
    }

    public function resend(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification email resent.'], 200);
    }
}
