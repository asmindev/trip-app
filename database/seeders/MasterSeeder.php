<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Branch;
use App\Models\TripType;
use App\Models\ExpenseCategory;
use App\Models\Ship;
use App\Models\TripRoute;
use App\Models\Pricelist;

class MasterSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Cabang (Branches)
        $kendari = Branch::create(['name' => 'Kendari', 'code' => 'KDI', 'status' => 'ACTIVE']);
        $palu = Branch::create(['name' => 'Palu', 'code' => 'PLW', 'status' => 'ACTIVE']);
        Branch::create(['name' => 'Manado', 'code' => 'MND', 'status' => 'ACTIVE']);
        Branch::create(['name' => 'Labengki', 'code' => 'LBK', 'status' => 'ACTIVE']);

        // 2. Tipe Trip (Pagi/Sore)
        $pagi = TripType::create(['name' => 'Trip Pagi', 'code' => 'PAGI', 'default_start_time' => '08:00:00']);
        $sore = TripType::create(['name' => 'Trip Sore', 'code' => 'SORE', 'default_start_time' => '15:00:00']);

        // 3. Kategori Pengeluaran
        ExpenseCategory::create(['name' => 'Bahan Bakar (BBM)', 'is_active' => true]);
        ExpenseCategory::create(['name' => 'Konsumsi Crew', 'is_active' => true]);
        ExpenseCategory::create(['name' => 'Maintenance Kapal', 'is_active' => true]);
        ExpenseCategory::create(['name' => 'Gaji Operasional', 'is_active' => true]);

        // 4. Kapal (Ships) - Contoh di Kendari & Palu
        $shipKendari = Ship::create([
            'branch_id' => $kendari->id,
            'name' => 'KM Bahteramas 01',
            'capacity' => 50,
            'status' => 'ACTIVE'
        ]);

        Ship::create([
            'branch_id' => $palu->id,
            'name' => 'KM Palu Ngataku',
            'capacity' => 40,
            'status' => 'ACTIVE'
        ]);

        // 5. Rute (Routes)
        $ruteKendari = TripRoute::create([
            'branch_id' => $kendari->id,
            'name' => 'Teluk Kendari - Pulau Bokori',
            'duration_minutes' => 180, // 3 Jam
            'waypoints' => [
                ['name' => 'Pelabuhan Nusantara', 'time' => '08:00'],
                ['name' => 'Pulau Bokori', 'time' => '09:30'],
                ['name' => 'Kembali ke Pelabuhan', 'time' => '11:00']
            ]
        ]);

        // 6. Pricelist (Harga)
        // Harga Pagi
        Pricelist::create([
            'trip_route_id' => $ruteKendari->id,
            'trip_type_id' => $pagi->id,
            'price_public' => 150000,
            'price_event' => 120000, // Lebih murah
            'is_active' => true
        ]);

        // Harga Sore (Misal lebih mahal dikit karena sunset)
        Pricelist::create([
            'trip_route_id' => $ruteKendari->id,
            'trip_type_id' => $sore->id,
            'price_public' => 175000,
            'price_event' => 140000,
            'is_active' => true
        ]);
    }
}
