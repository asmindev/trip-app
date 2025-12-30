<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Schedule;
use App\Models\Ship;
use App\Models\TripRoute;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        // $endOfLastMonth = $now->copy()->subMonth()->endOfMonth(); // Unused

        // Helper for previous month stats
        $previousMonthStats = function ($query) use ($startOfLastMonth) {
            return $query->whereMonth('created_at', $startOfLastMonth->month)
                ->whereYear('created_at', $startOfLastMonth->year);
        };

        // Helper for current month stats
        $currentMonthStats = function ($query) use ($now) {
            return $query->whereMonth('created_at', $now->month)
                ->whereYear('created_at', $now->year);
        };

        // 1. Metric Cards
        // Calculate Occupancy Rate (Seats Booked / Total Capacity of Schedules * 100)
        // This is an approximation based on total_passengers vs sum of schedule capacities for the month
        $totalCapacityCurrentMonth = Schedule::whereMonth('departure_date', $now->month)
            ->whereYear('departure_date', $now->year)
            ->with('ship')
            ->get()
            ->sum(fn($s) => $s->ship->capacity ?? 0);

        $totalPassengersCurrentMonth = (int) Booking::where('payment_status', 'PAID')
            ->whereHas('schedule', fn($q) => $q->whereMonth('departure_date', $now->month)->whereYear('departure_date', $now->year))
            ->sum('total_passengers');

        $occupancyRate = $totalCapacityCurrentMonth > 0
            ? ($totalPassengersCurrentMonth / $totalCapacityCurrentMonth) * 100
            : 0;

        $stats = [
            'revenue' => [
                'current' => (float) Booking::where('payment_status', 'PAID')
                    ->whereMonth('created_at', $now->month)
                    ->whereYear('created_at', $now->year)
                    ->sum('total_amount'),
                'last_month' => (float) Booking::where('payment_status', 'PAID')
                    ->whereMonth('created_at', $startOfLastMonth->month)
                    ->whereYear('created_at', $startOfLastMonth->year)
                    ->sum('total_amount'),
            ],
            'bookings' => [
                'current' => Booking::whereMonth('created_at', $now->month)
                    ->whereYear('created_at', $now->year)
                    ->count(),
                'last_month' => Booking::whereMonth('created_at', $startOfLastMonth->month)
                    ->whereYear('created_at', $startOfLastMonth->year)
                    ->count(),
            ],
            'passengers' => [
                'current' => (int) Booking::where('payment_status', 'PAID')
                    ->whereMonth('created_at', $now->month)
                    ->whereYear('created_at', $now->year)
                    ->sum('total_passengers'),
                'last_month' => (int) Booking::where('payment_status', 'PAID')
                    ->whereMonth('created_at', $startOfLastMonth->month)
                    ->whereYear('created_at', $startOfLastMonth->year)
                    ->sum('total_passengers'),
            ],
            'occupancy' => [
                'rate' => round($occupancyRate, 1),
                'label' => 'Avg. Occupancy'
            ],
            'active_ships' => Ship::where('status', 'ACTIVE')->count(), // Assuming status column exists or just count
            'todays_departures' => Schedule::whereDate('departure_date', $now->today())->count(),
        ];

        // 2. Revenue Chart (Last 30 days)
        $revenueData = Booking::where('payment_status', 'PAID')
            ->where('created_at', '>=', now()->subDays(30))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_amount) as total')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($item) => [
                'date' => Carbon::parse($item->date)->format('d M'),
                'amount' => (float) $item->total
            ]);

        // 3. Route Performance (Top 5)
        $routePerformance = DB::table('bookings')
            ->join('schedules', 'bookings.schedule_id', '=', 'schedules.id')
            ->join('trip_routes', 'schedules.trip_route_id', '=', 'trip_routes.id')
            ->where('bookings.payment_status', 'PAID')
            ->select('trip_routes.name', DB::raw('COUNT(bookings.id) as total_bookings'))
            ->groupBy('trip_routes.id', 'trip_routes.name')
            ->orderByDesc('total_bookings')
            ->limit(5)
            ->get();

        // 4. Recent Bookings
        $recentBookings = Booking::with(['user', 'schedule.route'])
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn($booking) => [
                'id' => $booking->id,
                'code' => $booking->booking_code,
                'customer' => $booking->user->name ?? 'Guest', // Handle deleted users
                'route' => $booking->schedule->route->name ?? 'Unknown Route',
                'amount' => (float) $booking->total_amount,
                'status' => $booking->payment_status,
                'date' => $booking->created_at->diffForHumans(),
            ]);

        return Inertia::render('admin/dashboard/index', [
            'stats' => $stats,
            'revenueData' => $revenueData,
            'routePerformance' => $routePerformance,
            'recentBookings' => $recentBookings,
        ]);
    }
}
