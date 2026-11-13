<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();

            // Coordonnées
            $table->string('phone_primary', 30)->nullable();
            $table->string('phone_secondary', 30)->nullable();
            $table->string('official_email')->nullable();
            $table->text('company_address')->nullable();

            // Horaires
            $table->json('working_days')->nullable();
            $table->time('opening_time')->nullable();
            $table->time('closing_time')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};