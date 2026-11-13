<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();

            $table->string('name', 150);
            $table->string('company', 150)->nullable();

            $table->string('email', 255)->index();
            $table->string('phone', 30)->nullable()->index();

            $table->string('address', 255)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('wilaya', 100)->nullable();

            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};