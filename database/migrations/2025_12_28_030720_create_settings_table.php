<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();

            // Key unik untuk dipanggil di kodingan. Contoh: 'booking_timeout'
            $table->string('key')->unique();

            // Label yang muncul di halaman Admin
            $table->string('label');

            // Value disimpan sebagai text, nanti dicasting di Model
            $table->text('value')->nullable();

            // Tipe datanya apa? (text, number, boolean, json)
            $table->string('type')->default('text');

            // Pengelompokan setting (General, Payment, Notification)
            $table->string('group')->default('general');

            // Siapa yang terakhir update
            $table->foreignId('updated_by')->nullable()->constrained('users');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
