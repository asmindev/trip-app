<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Branch;
use App\Models\TripType;
use App\Models\ExpenseCategory;
use App\Models\Ship;
use App\Models\TripRoute;
use App\Models\Pricelist;
use App\Models\Schedule;
use App\Models\Booking;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class MasterSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            // ==========================================
            // 1. MASTER DATA
            // ==========================================

            // 1.1 Branches
            $branches = ['Kendari', 'Palu', 'Manado', 'Labengki'];
            $branchModels = [];
            foreach ($branches as $name) {
                $code = strtoupper(substr($name, 0, 3));
                if ($name == 'Kendari') $code = 'KDI';
                if ($name == 'Palu') $code = 'PLW';
                // Manado -> MAN (default substr check), Labengki -> LAB

                $branchModels[$name] = Branch::firstOrCreate(
                    ['code' => $code],
                    ['name' => $name, 'location_address' => 'Jl. ' . $name, 'status' => 'ACTIVE']
                );
            }

            // 1.2 Tipe Trip
            $pagi = TripType::firstOrCreate(['code' => 'PAGI'], ['name' => 'Trip Pagi', 'default_start_time' => '08:00:00']);
            $sore = TripType::firstOrCreate(['code' => 'SORE'], ['name' => 'Trip Sore', 'default_start_time' => '15:00:00']);
            $reguler = TripType::firstOrCreate(['code' => 'REG'], ['name' => 'Reguler']);

            // 1.3 Kategori Pengeluaran
            $categories = [
                'Bahan Bakar (BBM)',
                'Konsumsi Crew',
                'Maintenance Kapal',
                'Gaji Operasional'
            ];
            foreach ($categories as $cat) {
                ExpenseCategory::firstOrCreate(['name' => $cat], ['is_active' => true]);
            }

            // 1.4 Kapal (Ships)
            $shipsData = [
                ['name' => 'KM Bahteramas 01', 'capacity' => 50, 'branch' => 'Kendari'],
                ['name' => 'Bahteramas I', 'capacity' => 80, 'branch' => 'Kendari'],
                ['name' => 'Bahteramas II', 'capacity' => 120, 'branch' => 'Kendari'],
                ['name' => 'KM Palu Ngataku', 'capacity' => 40, 'branch' => 'Palu'],
                ['name' => 'Teluk Palu Express', 'capacity' => 60, 'branch' => 'Palu'],
                ['name' => 'Bunaken Star', 'capacity' => 150, 'branch' => 'Manado'],
            ];

            foreach ($shipsData as $ship) {
                Ship::firstOrCreate(
                    ['name' => $ship['name']],
                    [
                        'branch_id' => $branchModels[$ship['branch']]->id,
                        'capacity' => $ship['capacity'],
                        'status' => 'ACTIVE'
                    ]
                );
            }

            // 1.5 Rute (Routes) & Pricelists
            $routesData = [
                [
                    'name' => 'Teluk Kendari - Pulau Bokori',
                    'branch' => 'Kendari',
                    'duration' => 180,
                    'prices' => [
                        ['type' => $pagi, 'public' => 150000, 'event' => 120000],
                        ['type' => $sore, 'public' => 175000, 'event' => 140000],
                    ]
                ],
                [
                    'name' => 'Kendari - Wawonii',
                    'branch' => 'Kendari',
                    'duration' => 180,
                    'prices' => [
                        ['type' => $reguler, 'public' => 150000, 'event' => 135000],
                    ]
                ],
                [
                    'name' => 'Kendari - Raha',
                    'branch' => 'Kendari',
                    'duration' => 240,
                    'prices' => [
                        ['type' => $reguler, 'public' => 180000, 'event' => 162000],
                    ]
                ],
                [
                    'name' => 'Palu - Donggala',
                    'branch' => 'Palu',
                    'duration' => 60,
                    'prices' => [
                        ['type' => $reguler, 'public' => 75000, 'event' => 67500],
                    ]
                ],
                [
                    'name' => 'Manado - Bunaken',
                    'branch' => 'Manado',
                    'duration' => 45,
                    'prices' => [
                        ['type' => $reguler, 'public' => 100000, 'event' => 90000],
                    ]
                ],
            ];

            foreach ($routesData as $r) {
                $route = TripRoute::firstOrCreate(
                    ['name' => $r['name']],
                    [
                        'branch_id' => $branchModels[$r['branch']]->id,
                        'duration_minutes' => $r['duration'],
                        'status' => 'ACTIVE'
                    ]
                );

                if (isset($r['waypoints'])) {
                    // Logic for waypoints if needed, but not present in data array struct above for shortness
                }

                foreach ($r['prices'] as $price) {
                    Pricelist::firstOrCreate(
                        ['trip_route_id' => $route->id, 'trip_type_id' => $price['type']->id],
                        [
                            'price_public' => $price['public'],
                            'price_event' => $price['event'],
                            'is_active' => true
                        ]
                    );
                }
            }

            // ==========================================
            // 2. TRANSACTION DATA (Dashboard Simulation)
            // ==========================================

            // Only seed transactions if users exist (or create them)
            if (User::count() < 5) {
                User::factory(10)->create();
            }
            $users = User::all();
            $allRoutes = TripRoute::with('branch')->get();
            $allShips = Ship::all();

            $startDate = Carbon::now()->subDays(35);
            $endDate = Carbon::now()->addDays(7);

            for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
                // Determine how many trips today
                $tripsCount = rand(2, 6);

                for ($i = 0; $i < $tripsCount; $i++) {
                    $route = $allRoutes->random();
                    // Pick ship from same branch
                    $ship = $allShips->where('branch_id', $route->branch_id)->random(); // might fail if no ship
                    if (!$ship) continue;

                    // Pick random trip type from pricelists available for this route
                    $pricelists = Pricelist::where('trip_route_id', $route->id)->get();
                    if ($pricelists->isEmpty()) continue;
                    $pricelist = $pricelists->random();

                    $schedule = Schedule::create([
                        'trip_route_id' => $route->id,
                        'ship_id' => $ship->id,
                        'trip_type_id' => $pricelist->trip_type_id,
                        'departure_date' => $date->format('Y-m-d'),
                        'departure_time' => sprintf('%02d:00:00', rand(6, 17)),
                        'available_seats' => $ship->capacity,
                        'status' => 'SCHEDULED',
                        'created_at' => $date, // To simulate history
                        'updated_at' => $date,
                    ]);

                    // If date is in past, generate bookings
                    if ($date->lt(Carbon::now())) {
                        $occupancyRate = rand(30, 90) / 100; // 30% to 90% full
                        $targetPassengers = floor($ship->capacity * $occupancyRate);
                        $currentPassengers = 0;

                        while ($currentPassengers < $targetPassengers) {
                            $pax = rand(1, 4);
                            if ($currentPassengers + $pax > $ship->capacity) {
                                $pax = $ship->capacity - $currentPassengers;
                            }
                            if ($pax <= 0) break;

                            $amount = $pricelist->price_public * $pax;

                            $booking = Booking::create([
                                'booking_code' => 'INV-' . strtoupper(uniqid()),
                                'user_id' => $users->random()->id,
                                'schedule_id' => $schedule->id,
                                'total_passengers' => $pax,
                                'subtotal' => $amount,
                                'total_amount' => $amount,
                                'payment_status' => 'PAID', // Assume paid for history
                                'created_at' => $date->copy()->addHours(rand(1,6)),
                                'updated_at' => $date->copy()->addHours(rand(6,8)),
                            ]);

                            $currentPassengers += $pax;
                        }

                        // Update schedule availability
                        $schedule->update(['available_seats' => $ship->capacity - $currentPassengers]);
                    }
                }
            }
        });
    }
}
