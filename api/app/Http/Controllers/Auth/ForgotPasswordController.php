<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class ForgotPasswordController extends Controller
{
    // Send password reset link
    public function sendResetLinkEmail(Request $request)
    {
        try {
            $request->validate(['email' => 'required|email']);

            $status = Password::sendResetLink(
                $request->only('email')
            );

            if ($status === Password::RESET_LINK_SENT) {
                return response()->json(['message' => __($status)], 200);
            } else {
                return response()->json(['error' => __($status)], 400);
            }
        } catch (\Exception $e) {
            Log::error('ForgotPasswordController@sendResetLinkEmail: ' . $e->getMessage());
            return response()->json(['error' => 'Server error: ' . $e->getMessage()], 500);
        }
    }

    // Handle password reset
    public function reset(Request $request)
    {
        try {
            $request->validate([
                'token' => 'required',
                'email' => 'required|email',
                'password' => 'required|confirmed|min:8',
            ]);

            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function ($user, $password) {
                    $user->password = Hash::make($password);
                    $user->save();
                }
            );

            if ($status === Password::PASSWORD_RESET) {
                return response()->json(['message' => __($status)], 200);
            } else {
                return response()->json(['error' => __($status)], 400);
            }
        } catch (\Exception $e) {
            Log::error('ForgotPasswordController@reset: ' . $e->getMessage());
            return response()->json(['error' => 'Server error: ' . $e->getMessage()], 500);
        }
    }
}
