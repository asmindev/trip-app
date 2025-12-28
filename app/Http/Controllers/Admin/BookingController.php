<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class BookingController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Booking::class);

        $bookings = QueryBuilder::for(Booking::class)
            ->with(['user', 'schedule.ship', 'schedule.route', 'schedule.tripType', 'passengers'])
            ->allowedFilters([
                'booking_code',
                AllowedFilter::exact('payment_status'),
                AllowedFilter::scope('date_range'),
            ])
            ->allowedSorts([
                'booking_date',
                'total_amount',
                'created_at',
            ])
            ->defaultSort('-created_at')
            ->paginate(15)
            ->withQueryString();

        $stats = [
            'total_bookings' => Booking::count(),
            'pending_payment' => Booking::where('payment_status', 'PENDING')->count(),
            'paid' => Booking::where('payment_status', 'PAID')->count(),
            'total_revenue' => Booking::where('payment_status', 'PAID')->sum('total_amount'),
        ];

        return Inertia::render('admin/bookings/index/page', [
            'bookings' => $bookings,
            'stats' => $stats,
        ]);
    }

    public function show(Booking $booking)
    {
        $this->authorize('view', $booking);

        $booking->load([
            'user',
            'schedule.ship',
            'schedule.route',
            'schedule.tripType',
            'passengers',
            'payment',
        ]);

        return Inertia::render('admin/bookings/show/page', [
            'booking' => $booking,
        ]);
    }

    public function destroy(Booking $booking)
    {
        $this->authorize('delete', $booking);

        $booking->delete();

        return redirect()->back()->with('success', 'Booking deleted successfully.');
    }
}
