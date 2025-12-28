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
        Schema::create('booking_passengers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete();
            $table->string('ticket_number')->unique()->nullable(); // TKT-XXX (Generated after paid)
            $table->string('full_name');
            $table->string('identity_number')->nullable(); // NIK/Passport
            $table->enum('gender', ['L', 'P'])->nullable();

            // Pricing info per pax
            $table->decimal('price', 15, 2);
            $table->boolean('is_free_ticket')->default(false); // Hasil promo Buy X Get Y

            // Scan Status
            $table->enum('scan_status', ['NOT_SCANNED', 'SCANNED'])->default('NOT_SCANNED');
            $table->timestamp('scanned_at')->nullable();
            $table->foreignId('scanned_by')->nullable()->constrained('users'); // Operator ID

            $table->timestamps();

            // CRITICAL INDEX: QR Scan Lookup (O(1) Access)
            // ticket_number sudah unique (otomatis index), kita tambah index untuk status
            $table->index(['booking_id', 'scan_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_passengers');
    }
};
