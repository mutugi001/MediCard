<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('details', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('user_id')->primary()->constrained('users')->onDelete('cascade');
            $table->string('firstname');
            $table->string('lastname');
            $table->dateTime('dateOfBirth');
            $table->string('gender');
            $table->string('bloodType');
            $table->string('allergies');
            $table->string('medicalConditions');
            $table->string('medications');
            $table->string('emergencyContact');
            $table->string('emergencyPhone');
            $table->string('insuranceProvider');
            $table->string('insurancePolicyNumber');
            $table->string('phoneNumber');
            $table->string('doctorName')->nullable();
            $table->string('doctorPhone')->nullable();
            $table->string('profilePhoto');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('details');
    }
};
