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

            // Key unik untuk dipanggil di kodingan. Contoh: 'app_name'
            $table->string('key')->unique()->index();

            // Label yang muncul di halaman Admin
            $table->string('label');

            // Value disimpan sebagai text, nanti dicasting di Model
            $table->text('value')->nullable();

            // Tipe datanya apa? (text, textarea, image, number, json)
            $table->string('type')->default('text');

            // Pengelompokan setting (general, landing, contact)
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
