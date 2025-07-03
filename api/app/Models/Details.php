<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Details extends Model
{
    protected $table = 'details';

    protected $fillable = [
        'user_id',
        'firstname',
        'lastname',
        'dateOfBirth',
        'gender',
        'bloodType',
        'allergies',
        'medicalConditions',
        'medications',
        'emergencyContact',
        'emergencyPhone',
        'insuranceProvider',
        'insurancePolicyNumber',
        'phoneNumber',
        'doctorName',
        'doctorPhone',
        'profilePhoto'
    ];

   public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
