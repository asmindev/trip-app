<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pricelists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trip_route_id')->constrained('trip_routes')->cascadeOnDelete();
            $table->foreignId('trip_type_id')->constrained('trip_types');

            // Menggunakan DECIMAL untuk uang (presisi tinggi)
            $table->decimal('price_public', 15, 2);
            $table->decimal('price_event', 15, 2);

            $table->date('effective_from')->nullable();
            $table->date('effective_until')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Composite Index untuk lookup harga cepat
            $table->index(['trip_route_id', 'trip_type_id', 'is_active'], 'idx_price_lookup');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pricelists');
    }
};
