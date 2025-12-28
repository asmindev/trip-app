<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Settings (sudah kita buat sebelumnya, tapi panggil lagi jika fresh)
        $this->call(SettingSeeder::class);

        // 2. Master Data (Cabang, Kapal, Rute, Harga)
        $this->call(MasterSeeder::class);

        // 3. User (Admin, Operator, Customer)
        $this->call(UserSeeder::class);

        // 4. Jadwal (Schedule)
        $this->call(ScheduleSeeder::class);
    }
}
