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

        // 5. Jadwal (Schedule) - Optional if MasterSeeder handles it, otherwise keep
        // If ScheduleSeeder is redundant now, we can remove it too, but user only asked to merge dashboard.
        // Let's assume MasterSeeder now covers all 'Dynamic' data too so we might not need ScheduleSeeder either if it does the same thing.
        // But for now, just remove logic regarding DashboardDataSeeder.

        // Note: I will keep ScheduleSeeder call if it's different logic, but based on context MasterSeeder now does heavy lifting.
        // Let's just remove DashboardDataSeeder line.
    }
}
