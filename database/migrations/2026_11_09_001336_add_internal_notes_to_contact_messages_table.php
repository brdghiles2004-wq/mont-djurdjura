
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('contact_messages', 'internal_notes')) {
            Schema::table('contact_messages', function (Blueprint $table) {
                $table->text('internal_notes')->nullable();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('contact_messages', 'internal_notes')) {
            Schema::table('contact_messages', function (Blueprint $table) {
                $table->dropColumn('internal_notes');
            });
        }
    }
};
