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

        // 3. Roles & Permissions (PENTING: Sebelum UserSeeder)
        $this->call(RolesAndPermissionsSeeder::class);

        // 4. User (Admin, Operator, Customer)
        $this->call(UserSeeder::class);

        // 5. Jadwal (Schedule)
        $this->call(ScheduleSeeder::class);
    }
}
