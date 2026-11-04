<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public $withinTransaction = false;

    public function up(): void
    {
        foreach ($this->indexStatements('CREATE') as $statement) {
            DB::statement($statement);
        }
    }

    public function down(): void
    {
        foreach ($this->indexStatements('DROP') as $statement) {
            DB::statement($statement);
        }
    }

    private function indexStatements(string $action): array
    {
        $concurrently = DB::getDriverName() === 'pgsql' ? ' CONCURRENTLY' : '';

        if ($action === 'CREATE') {
            return [
                "CREATE INDEX{$concurrently} IF NOT EXISTS user_onlines_active_user_idx ON user_onlines (user_id) WHERE leaving_at IS NULL",
                "CREATE INDEX{$concurrently} IF NOT EXISTS user_onlines_user_joined_idx ON user_onlines (user_id, joined_at DESC)",
                "CREATE INDEX{$concurrently} IF NOT EXISTS user_onlines_active_event_user_idx ON user_onlines (event_id, user_id) WHERE leaving_at IS NULL",
            ];
        }

        return [
            "DROP INDEX{$concurrently} IF EXISTS user_onlines_active_user_idx",
            "DROP INDEX{$concurrently} IF EXISTS user_onlines_user_joined_idx",
            "DROP INDEX{$concurrently} IF EXISTS user_onlines_active_event_user_idx",
        ];
    }
};
