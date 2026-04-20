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
        Schema::create('live_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->longText('content');
            $table->foreignUuid('room_id')->constrained('live_rooms');
            $table->foreignUuid('event_id')->constrained('live_events');
            $table->foreignUuid('sender_id')->constrained('users');
            $table->foreignUuid('reviewer_id')->nullable()->constrained('users');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('live_messages');
    }
};
