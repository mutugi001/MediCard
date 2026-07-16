<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use MongoDB\Laravel\Schema\Blueprint;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection('mongodb')->create('jobs', function (Blueprint $collection): void {
            $collection->index(['queue' => 1, 'reserved_at' => 1, 'available_at' => 1]);
            $collection->index('reserved_at');
        });

        Schema::connection('mongodb')->create('job_batches', function (Blueprint $collection): void {
            $collection->index('name');
            $collection->index('finished_at');
        });

        Schema::connection('mongodb')->create('failed_jobs', function (Blueprint $collection): void {
            $collection->unique('uuid');
            $collection->index('failed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('failed_jobs');
    }
};
