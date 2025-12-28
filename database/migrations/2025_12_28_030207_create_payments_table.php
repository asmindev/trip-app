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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings');

            // Xendit Specific Columns
            // external_id: ID unik yang kita kirim ke Xendit (biasanya = booking_code)
            $table->string('external_id')->unique();

            // xendit_id: ID transaksi dari sistem Xendit (disimpan setelah create invoice)
            $table->string('xendit_id')->nullable()->index();

            // Link pembayaran (Invoice URL) untuk redirect user
            $table->string('checkout_url')->nullable();

            $table->string('payment_method')->nullable(); // OVO, DANA, BANK_TRANSFER
            $table->enum('status', ['PENDING', 'PAID', 'EXPIRED', 'FAILED'])->default('PENDING');
            $table->decimal('amount', 15, 2);

            // Simpan raw response webhook untuk debugging
            $table->json('gateway_response')->nullable();

            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            // Index Strategi untuk Webhook Xendit (Idempotency)
            // Xendit akan kirim webhook berdasarkan external_id atau xendit_id
            $table->index(['external_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
