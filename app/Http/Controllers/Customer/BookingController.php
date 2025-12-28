<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Services\BookingService; // Service Class (Next Step)
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use App\Data\CreateBookingData; // Import DTO
use DB;

class BookingController extends Controller
{
    protected $bookingService;

    // Dependency Injection Service
    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    // Halaman Pencarian Tiket
    public function index()
    {
        $schedules = QueryBuilder::for(Schedule::class)
            ->allowedFilters([
                AllowedFilter::exact('trip_route_id'),
                AllowedFilter::exact('departure_date'),
            ])
            ->available() // Scope: status SCHEDULED & seats > 0
            ->with(['route', 'ship', 'tripType'])
            ->orderBy('departure_time')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('customer/booking/index/page', [
            'schedules' => $schedules,
        ]);
    }

    // Halaman Form Isi Data Penumpang
    public function create(Schedule $schedule)
    {
        // Load harga yang aktif
        $schedule->load(['route.pricelists' => function ($q) use ($schedule) {
            $q->where('trip_type_id', $schedule->trip_type_id)
                ->where('is_active', true);
        }]);

        return Inertia::render('customer/booking/create/page', [
            'schedule' => $schedule,
        ]);
    }

    public function store(Request $request)
    {
        // Validasi & Transform Input menggunakan Spatie Data
        // Otomatis validasi sesuai rules di DTO (jika ada) atau mapping array
        $bookingData = CreateBookingData::from([
            'schedule_id' => $request->input('schedule_id'),
            'passengers' => $request->input('passengers'),
            'promo_code' => $request->input('promo_code'),
        ]);

        try {
            // Panggil Service
            $booking = $this->bookingService->createBooking(
                user: auth()->user(),
                data: $bookingData // Kirim DTO, bukan array mentah
            );

            // Redirect ke Invoice Xendit / Halaman Payment Lokal
            return Inertia::location($booking->payment->checkout_url);
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    // Halaman Detail Pembayaran
    public function payment($code)
    {
        $booking = \App\Models\Booking::with(['payment', 'passengers', 'schedule.route'])
            ->where('booking_code', $code)
            ->firstOrFail();

        // Cek Policy (BookingPolicy::view)
        // Jika gagal, otomatis return 403 Forbidden
        $this->authorize('view', $booking);

        return Inertia::render('customer/booking/payment', [
            'booking' => $booking,
            // Jika ada invoice URL Xendit, kirim ke frontend
            'checkout_url' => $booking->payment?->checkout_url,
        ]);
    }
}
