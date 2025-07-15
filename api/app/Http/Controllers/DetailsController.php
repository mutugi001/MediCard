<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Details;
use App\Models\User;
use Illuminate\Http\Client\ResponseSequence;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class DetailsController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $details = Details::where('user_id', $user->id)->first();
        // return dd($user);
        if (isset($details->dateOfBirth)) {
            $dob = new \DateTime($details->dateOfBirth);
            $now = new \DateTime();
            $age = $dob->diff($now)->y;
            $details->age = $age;
        }
        if (!$details) {
            return response()->json('Details for user not found');
        }
        return response()->json($details, 200);
    }

    public function store(Request $request)
    {
        $details = $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'dateOfBirth' => 'required|string|max:255',
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
            'doctorName' => 'required|string|max:255',
            'doctorPhone' => 'required|string|max:255',
            'profilePhoto' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048'
        ]);



        // Now send image to FastAPI for facial encoding
        if ($request->hasFile('profilePhoto')) {
            $file = $request->file('profilePhoto'); // 'image' is the field name from FormData
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('profile_photos');
        }
        // If the file is not uploaded, return an error response
        if (!$file) {
            return response()->json(['error' => 'No image file uploaded'], 400);
        }
        // Ensure the folder exists
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }

        // Move the uploaded file to the public/profile_photos directory
        $file->move($destinationPath, $filename);
        $imagePath = url('profile_photos/' . $filename);
        $details['profilePhoto'] = $imagePath;

         // Save user details first
        $authuser = Auth::user();
        $user = User::find($authuser->id);
        $user->details()->create($details);
        $userId = $user->id;

        $relativePath = parse_url($imagePath, PHP_URL_PATH);
        $relativePath = ltrim($relativePath, '/');

        // Build full system file path
        $fullPath = public_path($relativePath);

        // $fullPath = storage_path($imagePath);
        $response = Http::attach(
            'file',
            fopen($fullPath, 'r'),
            'face.jpg'
        )->post("http://fastapi-face:8001/register-face/{$userId}");

        response()->json([
            'success' => true,
            'message' => 'Face recognition request sent successfully',
            'response' => $response->json()
        ], 200);

        // Optionally, log or check FastAPI response
        if (!$response->successful()) {
            return response()->json(['error' => 'Face registration failed', 'fastapi' => $response->json()], 500);
        }

        return response()->json(['success' => true, 'details' => $details], 200);
    }


    public function show($userId)
    {
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

    // public function faceRecognition()
    // {
    //     $authuser = Auth::user();
    //     $user = User::find($authuser->id);
    //     $details = Details::where('user_id', $user->id)->first();
    //     $imagePath = $details->profilePhoto;
    //     $userId = $user->id;

    //     $relativePath = parse_url($imagePath, PHP_URL_PATH);
    //     $relativePath = ltrim($relativePath, '/');

    // // Build full system file path
    // $fullPath = public_path($relativePath);
    // // e.g., D:\MedicalCard\MediCard\api\storage\app\public\profile_photos\xyz.jpg

    // if (!file_exists($fullPath)) {
    //     return response()->json(['error' => 'Image not found at path: ' . $fullPath], 404);
    // }
    //     // $fullPath = storage_path($imagePath);
    //     $response = Http::attach(
    //         'file',
    //         fopen($fullPath, 'r'),
    //         'face.jpg'
    //     )->post("http://127.0.0.1:8001/register-face/{$userId}");

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Face recognition request sent successfully',
    //         'response' => $response->json()
    //     ], 200);
    // }

    public function faceMatch(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image'); // 'image' is the field name from FormData
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('faces');
        }

        // Ensure the folder exists
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }

        // Move the uploaded file to the public/profile_photos directory
        $file->move($destinationPath, $filename);

        // Generate public URL to access the image
        $imagePath = url('faces/' . $filename);

        $relativePath = parse_url($imagePath, PHP_URL_PATH);
        $relativePath = ltrim($relativePath, '/');

        // Build full system file path
        $fullPath = public_path($relativePath);
        // e.g., D:\MedicalCard\MediCard\api\storage\app\public\profile_photos\xyz.jpg

        if (!file_exists($fullPath)) {
            return response()->json(['error' => 'Image not found at path: ' . $fullPath], 404);
        }
        // $fullPath = storage_path($imagePath);
        $response = Http::attach(
            'file',
            fopen($fullPath, 'r'),
            'face.jpg'
        )->post("http://fastapi-face:8001/match");

        $patientId = $response->json('patient_id');

        $user = User::where('id', $patientId)->first();
        $userId = $user->id;
        return response()->json([
            'success' => true,
            'message' => 'Face match request sent successfully',
            'user_id' => $userId
        ], 200);
    }
}
