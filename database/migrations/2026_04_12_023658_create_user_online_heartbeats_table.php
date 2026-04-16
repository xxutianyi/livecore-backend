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
        Schema::create('user_online_heartbeats', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->jsonb('meta');
            $table->foreignUuid('online_id')->constrained('user_onlines');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_online_heartbeats');
    }
};
