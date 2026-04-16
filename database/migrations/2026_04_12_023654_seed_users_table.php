<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        User::create([
            'name' => 'WingLab',
            'role' => 'admin',
            'phone' => 'WingLab',
            'email' => 'live@winglab.dev',
            'password' => Hash::make('WingLab'),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        User::where('name', 'WingLab')->forceDelete();
    }
};
