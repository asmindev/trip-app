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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_code')->unique(); // BKG-2025...
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('schedule_id')->constrained('schedules');
            $table->foreignId('promotion_id')->nullable()->constrained('promotions');

            // Financials
            $table->decimal('subtotal', 15, 2);
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('total_amount', 15, 2);
            $table->integer('total_passengers');

            // Status & Workflow
            $table->enum('payment_status', ['PENDING', 'PAID', 'EXPIRED', 'REFUNDED', 'FAILED'])->default('PENDING');
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expires_at')->nullable(); // Untuk Lock 5 Menit / 1 Jam

            $table->timestamps();
            $table->softDeletes();

            // INDEXING STRATEGY (MySQL Compatible Covering Index)
            // Membantu query history user tanpa perlu join berat
            $table->index(['user_id', 'created_at', 'payment_status', 'booking_code'], 'idx_user_history_covering');

            // Membantu Scheduler membersihkan booking expired
            $table->index(['payment_status', 'expires_at'], 'idx_cleanup_expired');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
