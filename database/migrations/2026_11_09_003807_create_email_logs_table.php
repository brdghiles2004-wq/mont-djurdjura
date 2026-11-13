
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_logs', function (Blueprint $table) {
            $table->id();

            $table->string('recipient');
            $table->json('cc')->nullable();
            $table->json('bcc')->nullable();

            $table->string('subject');
            $table->longText('body_html')->nullable();
            $table->longText('body_text')->nullable();

            $table->string('type', 60)->default('custom');
            $table->string('status', 20)->default('pending');

            $table->text('error_message')->nullable();
            $table->string('message_id')->nullable();

            $table->string('related_type')->nullable();
            $table->unsignedBigInteger('related_id')->nullable();

            $table->unsignedInteger('attempt_count')->default(0);
            $table->timestamp('last_attempt_at')->nullable();
            $table->timestamp('sent_at')->nullable();

            $table->unsignedBigInteger('created_by')->nullable();
            $table->json('metadata')->nullable();

            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index(['type', 'created_at']);
            $table->index(['related_type', 'related_id']);
            $table->index('recipient');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_logs');
    }
};
