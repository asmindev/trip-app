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
        Schema::table('payments', function (Blueprint $table) {
            $table->string('payment_type')->nullable()->after('status'); // VIRTUAL_ACCOUNT, QR_CODE
            $table->string('payment_channel')->nullable()->after('payment_type'); // BCA, BRI, MANDIRI
            $table->string('payment_code')->nullable()->after('payment_channel'); // VA Number or QR String
            $table->timestamp('expiration_date')->nullable()->after('amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn(['payment_type', 'payment_channel', 'payment_code', 'expiration_date']);
        });
    }
};
