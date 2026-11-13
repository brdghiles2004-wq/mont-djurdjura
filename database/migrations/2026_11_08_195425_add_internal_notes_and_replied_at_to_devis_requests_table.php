
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Les deux colonnes existent déjà dans la base de données.
    }

    public function down(): void
    {
        // Ne rien supprimer pour préserver les données.
    }
};
