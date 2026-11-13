<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (
            Schema::hasTable('contact_messages') &&
            !Schema::hasColumn('contact_messages', 'client_id')
        ) {
            Schema::table('contact_messages', function (Blueprint $table) {
                $table->foreignId('client_id')
                    ->nullable()
                    ->constrained('clients')
                    ->nullOnDelete();
            });
        }

        if (
            Schema::hasTable('devis_requests') &&
            !Schema::hasColumn('devis_requests', 'client_id')
        ) {
            Schema::table('devis_requests', function (Blueprint $table) {
                $table->foreignId('client_id')
                    ->nullable()
                    ->constrained('clients')
                    ->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        if (
            Schema::hasTable('contact_messages') &&
            Schema::hasColumn('contact_messages', 'client_id')
        ) {
            Schema::table('contact_messages', function (Blueprint $table) {
                $table->dropConstrainedForeignId('client_id');
            });
        }

        if (
            Schema::hasTable('devis_requests') &&
            Schema::hasColumn('devis_requests', 'client_id')
        ) {
            Schema::table('devis_requests', function (Blueprint $table) {
                $table->dropConstrainedForeignId('client_id');
            });
        }
    }
};