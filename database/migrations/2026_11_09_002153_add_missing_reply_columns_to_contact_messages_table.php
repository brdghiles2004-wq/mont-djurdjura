
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $columns = [
            'internal_notes' => 'text',
            'reply_message' => 'text',
            'replied_at' => 'timestamp',
        ];

        foreach ($columns as $column => $type) {
            if (!Schema::hasColumn('contact_messages', $column)) {
                Schema::table('contact_messages', function (Blueprint $table) use ($column, $type) {
                    if ($type === 'timestamp') {
                        $table->timestamp($column)->nullable();
                    } else {
                        $table->text($column)->nullable();
                    }
                });
            }
        }
    }

    public function down(): void
    {
        Schema::table('contact_messages', function (Blueprint $table) {
            $columns = [];

            foreach (['internal_notes', 'reply_message', 'replied_at'] as $column) {
                if (Schema::hasColumn('contact_messages', $column)) {
                    $columns[] = $column;
                }
            }

            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};
