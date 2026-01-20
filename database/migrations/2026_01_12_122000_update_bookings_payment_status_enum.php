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
        // For MySQL/MariaDB, we modify the column.
        // For SQLite (testing), we might need a workaround, but Laravel 11/12 handles enum modification reasonably well via Doctrine
        // However, raw SQL is safer for Enums in some drivers.

        // Since we are likely on MySQL in prod/dev but SQLite in test.
        // SQLite doesn't natively support ENUMs (it uses TEXT check constraints).
        // To fix the test, we need to allow REFUND_NEEDED.

        Schema::table('bookings', function (Blueprint $table) {
            // Drop valid check constraint if exists (SQLite specific usually handled by dropping/recreating table or turning off constraints, but Laravel schema builder helps).
            // Simplest way for 'ENUM' in Laravel across drivers is to use string in migration but set it as enum.
            // If it's already an enum, we just modify it.

            $table->enum('payment_status', [
                'PENDING', 'PAID', 'EXPIRED', 'CANCELLED', 'FAILED', 'REFUND_NEEDED'
            ])->default('PENDING')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
             $table->enum('payment_status', [
                'PENDING', 'PAID', 'EXPIRED', 'CANCELLED', 'FAILED'
            ])->default('PENDING')->change();
        });
    }
};
