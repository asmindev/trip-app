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
        Schema::create('scan_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_passenger_id')->constrained('booking_passengers');
            $table->foreignId('operator_id')->constrained('users');
            $table->timestamp('scanned_at');
            $table->string('device_info')->nullable(); // User Agent / Device ID
            $table->string('scan_result')->default('SUCCESS'); // SUCCESS / DOUBLE_SCAN / INVALID
            $table->timestamps();

            $table->index(['booking_passenger_id', 'scanned_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scan_logs');
    }
};
