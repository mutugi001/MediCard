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
    Schema::create('patient_faces', function (Blueprint $table) {
        $table->id(); // Auto-incrementing primary key
        $table->foreignUuid('patient_id'); // Foreign UUID (adjust type to match patients table)
        $table->binary('encoding'); // For storing the face encoding as binary blob
        $table->timestamps();
       });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient__faces');
    }
};
