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
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trip_route_id')->constrained('trip_routes');
            $table->foreignId('trip_type_id')->constrained('trip_types');
            $table->foreignId('ship_id')->constrained('ships');

            $table->date('departure_date');
            $table->time('departure_time');

            // Atomic decrement akan dilakukan di kolom ini
            $table->integer('available_seats');

            $table->enum('status', ['SCHEDULED', 'DEPARTED', 'CANCELLED', 'COMPLETED'])->default('SCHEDULED');
            $table->timestamps();
            $table->softDeletes();

            // BEST PRACTICE INDEX: Customer search schedule
            $table->index(['trip_route_id', 'departure_date', 'status', 'available_seats'], 'idx_schedule_search');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
