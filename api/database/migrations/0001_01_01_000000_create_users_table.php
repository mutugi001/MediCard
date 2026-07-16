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
        Schema::connection('mongodb')->create('users', function (Blueprint $collection): void {
            $collection->unique('email');
            $collection->index('name');
            $collection->index('email_verified_at');
        });

        Schema::connection('mongodb')->create('password_reset_tokens', function (Blueprint $collection): void {
            $collection->unique('email');
            $collection->index('created_at');
        });

        Schema::connection('mongodb')->create('sessions', function (Blueprint $collection): void {
            $collection->index('user_id');
            $collection->index('last_activity');
            $collection->expire('expires_at', 0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
