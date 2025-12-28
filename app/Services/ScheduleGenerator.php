<?php

namespace App\Services;

use App\Models\Schedule;
use App\Models\Ship;
use App\Models\TripRoute;
use App\Models\TripType;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ScheduleGenerator
{
    /**
     * Generate schedules based on configuration
     *
     * @param array $config
     * @param bool $dryRun If true, only returns preview without saving
     * @return Collection
     */
    public function generate(array $config, bool $dryRun = false): Collection
    {
        // Config structure:
        // [
        //    'ship_id' => 1,
        //    'trip_route_id' => 1,
        //    'trip_type_id' => 1,
        //    'start_date' => '2024-01-01',
        //    'end_date' => '2024-01-31',
        //    'days_of_week' => [1, 3, 5], // Mon, Wed, Fri
        //    'departure_time' => '08:00',
        // ]

        $ship = Ship::findOrFail($config['ship_id']);
        $route = TripRoute::findOrFail($config['trip_route_id']);
        $tripType = TripType::findOrFail($config['trip_type_id']);

        $startDate = Carbon::parse($config['start_date']);
        $endDate = Carbon::parse($config['end_date']);
        $period = CarbonPeriod::create($startDate, $endDate);

        $generatedSchedules = collect();

        foreach ($period as $date) {
            // Check if day matches selected days (0=Sun, 1=Mon, ..., 6=Sat)
            // Carbon dayOfWeek: 0 (Sunday) - 6 (Saturday)
            // Frontend might send 1-7 or 0-6, let's assume 0-6 standard
            if (in_array($date->dayOfWeek, $config['days_of_week'])) {

                $scheduleData = [
                    'trip_route_id' => $route->id,
                    'trip_type_id' => $tripType->id,
                    'ship_id' => $ship->id,
                    'departure_date' => $date->format('Y-m-d'),
                    'departure_time' => $config['departure_time'],
                    'available_seats' => $ship->capacity,
                    'status' => 'SCHEDULED',
                ];

                if ($dryRun) {
                    $generatedSchedules->push($scheduleData);
                } else {
                    // Check conflicts before saving
                    if (!$this->hasConflict($ship->id, $date->format('Y-m-d'), $config['departure_time'])) {
                        $schedule = Schedule::create($scheduleData);
                        $generatedSchedules->push($schedule);
                    }
                }
            }
        }

        return $generatedSchedules;
    }

    /**
     * Check if ship is already booked at this time
     */
    public function hasConflict(int $shipId, string $date, string $time): bool
    {
        // Simplified conflict check: Same ship, same day, same time +/- buffer?
        // For now, exact match check
        return Schedule::where('ship_id', $shipId)
            ->where('departure_date', $date)
            ->where('departure_time', $time)
            ->where('status', '!=', 'CANCELLED')
            ->exists();
    }
}
