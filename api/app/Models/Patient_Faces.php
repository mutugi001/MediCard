<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Patient_Faces extends Model
{
    protected $connection = 'mongodb';

    protected $table = 'patient_faces';

    protected $casts = [
        'patient_id' => 'string',
    ];

    protected $fillable = [
        'patient_id',
        'encoding',
    ];
}
