<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            $user = User::where('email', $request->email)->first();

            if (! $user || ! Hash::check($request->password, $user->password)) {
                throw ValidationException::withMessages([
                    'email' => ['The provided credentials are incorrect.'],
                ]);
            }

            $token = $user->createToken($request->email)->plainTextToken;

            return $token;
        } catch(ValidationException $e) {
            Log::error('Login failed: ' . $e->getMessage());
            return response()->json(['error' => 'Invalid credentials'], 401);
        } catch (\Exception $e) {
            Log::error('Login failed: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }

}
