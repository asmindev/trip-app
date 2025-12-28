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
        Schema::create('trip_types', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Trip Pagi, Trip Sore
            $table->string('code')->unique(); // PAGI, SORE
            $table->time('default_start_time')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trip_types');
    }
};
