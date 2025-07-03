<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegistrationController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user =  User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken($user->name)->plainTextToken;

        return response()->json($token);
    }

    // $user =  User::create([
    //     'company_name' => "Mutugi",
    //     'username' => "mutugi001",
    //     'email' => "collins@gmail.com",
    //     'password' => Hash::make("password"),
    // ]);

    // $token = $user->createToken($user->username)->plainTextToken;
    // return response()->json([
    //     'token' => $token,
    //     'user' => $user,
    // ]);
}

