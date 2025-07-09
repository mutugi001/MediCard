<?php

use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegistrationController;
use App\Http\Controllers\DetailsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', RegistrationController::class);
Route::post('/login', LoginController::class);
Route::post('/logout', LogoutController::class)->middleware('auth:sanctum');
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [ForgotPasswordController::class, 'reset']);
Route::get('/{userId}/show', [DetailsController::class, 'show'])->name('api.show');
Route::post('/faceMatch', [DetailsController::class, 'faceMatch']);


    Route::middleware([
    'web',
    'auth:sanctum',
])->group(function () {
    Route::prefix('details')->controller(DetailsController::class)->group(function() {
        Route::get('/index', 'index')->name('details.index');
        Route::post('/store', 'store')->name('details.store');
        Route::post('/{details}/update', 'update')->name('details.update');
        Route::delete('/{details}/destroy', 'destroy')->name('details.destroy');
        // Route::post('/register-face', 'registerFace')->name('details.registerFace');
        // Route::get('/faceRecognition', 'faceRecognition')->name('details.faceRecognition');

    });
});
