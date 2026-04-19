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
        Schema::create('live_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('cover')->nullable();
            $table->longText('description')->nullable();
            $table->string('push_url')->nullable();
            $table->string('pull_url')->nullable();
            $table->string('playback_url')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->boolean('published')->default(false);
            $table->foreignUuid('room_id')->constrained('live_rooms');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('live_events');
    }
};
