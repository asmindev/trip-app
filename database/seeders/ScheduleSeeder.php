<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Schedule;
use App\Models\TripRoute;
use App\Models\TripType;
use App\Models\Ship;
use Carbon\Carbon;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $route = TripRoute::where('name', 'like', '%Kendari%')->first();
        $ship = Ship::where('branch_id', $route->branch_id)->first();
        $typePagi = TripType::where('code', 'PAGI')->first();
        $typeSore = TripType::where('code', 'SORE')->first();

        // Buat jadwal untuk 7 hari ke depan
        for ($i = 0; $i < 7; $i++) {
            $date = Carbon::now()->addDays($i)->format('Y-m-d');

            // Jadwal Pagi
            Schedule::create([
                'trip_route_id' => $route->id,
                'trip_type_id' => $typePagi->id,
                'ship_id' => $ship->id,
                'departure_date' => $date,
                'departure_time' => '08:00:00',
                'available_seats' => $ship->capacity, // 50
                'status' => 'SCHEDULED'
            ]);

            // Jadwal Sore
            Schedule::create([
                'trip_route_id' => $route->id,
                'trip_type_id' => $typeSore->id,
                'ship_id' => $ship->id,
                'departure_date' => $date,
                'departure_time' => '15:30:00',
                'available_seats' => $ship->capacity, // 50
                'status' => 'SCHEDULED'
            ]);
        }
    }
}
