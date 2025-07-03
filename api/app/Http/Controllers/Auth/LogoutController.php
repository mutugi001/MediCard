<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LogoutController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        if ($request->user() == Auth::user()) {
            // Revoke the user's current access token. This is important for Sanctum.
            $request->user()->currentAccessToken()->delete();

            return response()->json(true, 204);
        } else {
            // User is not authenticated.
            return response()->json(['message' => 'User not authenticated'], 401);
        }
    }
    }

