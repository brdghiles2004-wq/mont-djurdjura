<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('devis_requests', function (Blueprint $table) {
            $table->id();

            $table->string('name', 150);
            $table->string('company', 150)->nullable();
            $table->string('email', 255);
            $table->string('phone', 30);

            $table->string('product', 200);
            $table->unsignedInteger('quantity');

            $table->string('request_type', 50);
            $table->text('message')->nullable();

            $table->string('status', 30)->default('new');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('devis_requests');
    }
};