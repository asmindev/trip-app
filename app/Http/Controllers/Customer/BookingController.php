<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Schedule;
use App\Models\TripType;
use App\Services\BookingService; // Service Class (Next Step)
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use App\Data\CreateBookingData; // Import DTO
use DB;

class BookingController extends Controller
{
    protected $bookingService;
    protected $paymentService;

    // Dependency Injection Service
    public function __construct(BookingService $bookingService, PaymentService $paymentService)
    {
        $this->bookingService = $bookingService;
        $this->paymentService = $paymentService;
    }

    // Halaman Pencarian Tiket
    public function index()
    {
        $schedules = QueryBuilder::for(Schedule::class)
            ->allowedFilters([
                AllowedFilter::exact('trip_route_id'),
                AllowedFilter::exact('departure_date'),
                AllowedFilter::exact('trip_type_id'),
            ])
            ->available() // Scope: status SCHEDULED & seats > 0
            ->with(['route.pricelists' => function($q) {
                $q->where('is_active', true);
            }, 'ship', 'tripType'])
            ->orderBy('departure_time')
            ->paginate(10)
            ->withQueryString();

        $tripTypes = TripType::all(['id', 'name', 'code']);
        Log::info('Trip Types: ' . json_encode($tripTypes));

        return Inertia::render('customer/booking/index/page', [
            'schedules' => $schedules,
            'trip_types' => $tripTypes,
        ]);
    }

    // Halaman Form Isi Data Penumpang
    public function create(Schedule $schedule)
    {
        // Load harga yang aktif
        $schedule->load(['route.pricelists' => function($q) {
            $q->where('is_active', true);
        }, 'ship', 'tripType']);

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

            // Redirect to Internal Payment Page
            return to_route('booking.payment', $booking->booking_code);
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    // Halaman Detail Pembayaran
    public function payment($code)
    {

        $booking = Booking::with(['payment', 'passengers', 'schedule.route', 'schedule.ship', 'schedule.tripType'])
            ->where('booking_code', $code)
            ->firstOrFail();

        // Cek Policy (BookingPolicy::view)
        // Jika gagal, otomatis return 403 Forbidden
        $this->authorize('view', $booking);
        // Log::info('Booking Code: ' . js));
        // $paymentRequestId = $booking->payment->xendit_id;

        try {
            // Update Sync Payment Status (Logic Moved to Service)
            if ($booking->payment) {
                $this->paymentService->syncPaymentStatus($booking->payment);
            }

            // Refresh booking to get latest data
            $booking->refresh();
        } catch (\Exception $e) {
            Log::error('Failed to sync payment status in controller: ' . $e->getMessage());
        }

        return Inertia::render('customer/booking/payment', [
            'booking' => $booking,
            // Jika ada invoice URL Xendit, kirim ke frontend
            'checkout_url' => $booking->payment?->checkout_url,
        ]);
    }
}
