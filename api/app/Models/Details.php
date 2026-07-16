<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use MongoDB\Laravel\Eloquent\Model;

class Details extends Model
{
    protected $connection = 'mongodb';

    protected $table = 'details';

    protected $casts = [
        'user_id' => 'string',
        'dateOfBirth' => 'datetime',
    ];

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
