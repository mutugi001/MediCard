<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Details;
use App\Models\User;
use Illuminate\Http\Client\ResponseSequence;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DetailsController extends Controller
{
    public function index(){
        $user = Auth::user();

        $details = Details::where('user_id', $user->id)->first();
        // return dd($user);
         if (isset($details['date_of_birth'])) {
            $dob = new \DateTime($details['date_of_birth']);
            $now = new \DateTime();
            $age = $dob->diff($now)->y;
            $details->age = $age;
        }
        if(!$details){
            return response()->json('Details for user not found');
        }
        return response()->json($details, 200);
    }

    public function store(Request $request)
    {
        // return response()->json($request, 200);

         $details = $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'dateOfBirth' =>'required|string|max:255',
            'gender' => 'required|string|max:10',
            'bloodType' => 'required|string|max:10',
            'allergies' => 'required|string|max:255',
            'medicalConditions' => 'nullable|string|max:255',
            'medications' => 'nullable|string|max:255',
            'emergencyContact' => 'required|string|max:255',
            'emergencyPhone' => 'required|string|max:255',
            'insuranceProvider' => 'required|string|max:255',
            'insurancePolicyNumber' => 'nullable|string|max:255',
            'phoneNumber' => 'required|string|max:255',
            'doctorName' =>'required|string|max:255',
            'doctorPhone' => 'required|string|max:255',
            'profilePhoto' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048'
         ]);

        if ($request->hasFile('profilePhoto')) {
            $image = $request->file('profilePhoto');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('profile_photos'), $imageName);
            $details['profilePhoto'] = url('profile_photos/' . $imageName);
        }

         $authuser = Auth::user();
         $user = User::find($authuser->id);
         $user->details()->create($details);

         return response()->json($details, 200);
    }

    public function show($userId){
        $user = User::where('id', $userId)->first();
        $details = $user->details()->first();
        if (isset($details->dateOfBirth)) {
            $dob = new \DateTime($details->dateOfBirth);
            $now = new \DateTime();
            $age = $dob->diff($now)->y;
            $details->age = $age;
        }

        return Response()->json($details, 200);

    }
}
