<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('live_room_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('room_id')->constrained('live_rooms');
            $table->unsignedInteger('users_count')->default(0);
            $table->unsignedInteger('messages_count')->default(0);
            $table->unsignedInteger('messages_reviewed_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('live_room_stats');
    }
};
