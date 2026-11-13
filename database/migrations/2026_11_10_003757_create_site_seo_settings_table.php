
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_seo_settings', function (Blueprint $table) {
            $table->id();

            $table->string('site_name_fr')->nullable();
            $table->string('site_name_en')->nullable();
            $table->string('site_name_ar')->nullable();

            $table->string('default_meta_title_fr')->nullable();
            $table->string('default_meta_title_en')->nullable();
            $table->string('default_meta_title_ar')->nullable();

            $table->text('default_meta_description_fr')->nullable();
            $table->text('default_meta_description_en')->nullable();
            $table->text('default_meta_description_ar')->nullable();

            $table->string('default_og_image')->nullable();

            $table->boolean('robots_index')->default(true);
            $table->boolean('robots_follow')->default(true);

            $table->string('google_site_verification')->nullable();
            $table->string('bing_site_verification')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_seo_settings');
    }
};
