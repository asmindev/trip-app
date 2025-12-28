<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();

            // Siapa yang melakukan aksi? (Nullable karena bisa jadi System/Guest)
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();

            // Apa aksinya? (CREATE, UPDATE, DELETE, LOGIN, LOGOUT, SCAN)
            $table->string('action');

            // Objek apa yang kena dampak?
            $table->string('table_name')->nullable(); // misal: bookings
            $table->unsignedBigInteger('record_id')->nullable(); // misal: ID bookingnya

            // Detil perubahan (JSON)
            $table->json('old_values')->nullable(); // Data sebelum diedit
            $table->json('new_values')->nullable(); // Data setelah diedit

            // Security Context
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('url')->nullable(); // Dari URL mana aksesnya

            $table->timestamps();

            // Indexes untuk pencarian cepat di menu Log Aktivitas
            $table->index(['user_id', 'created_at']);
            $table->index(['table_name', 'record_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
