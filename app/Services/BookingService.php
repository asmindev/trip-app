<?php

namespace App\Services;

use App\Data\CreateBookingData;
use App\Models\Booking;
use App\Models\Schedule;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Exception;

class BookingService
{
    public function __construct(
        protected PricingService $pricingService,
        protected PaymentService $paymentService
    ) {
    }

    public function createBooking(User $user, CreateBookingData $data): Booking
    {
        $totalPassengers = count($data->passengers);
        $lockKey = "booking_lock:schedule:{$data->schedule_id}";

        return Cache::lock($lockKey, 10)->block(5, function () use ($user, $data, $totalPassengers) {

            return DB::transaction(function () use ($user, $data, $totalPassengers) {

                $schedule = Schedule::lockForUpdate()->find($data->schedule_id);

                if (!$schedule) {
                    throw new Exception("Jadwal tidak ditemukan.");
                }

                if ($schedule->available_seats < $totalPassengers) {
                    throw new Exception("Mohon maaf, sisa kursi tidak mencukupi. Tersisa: {$schedule->available_seats}");
                }

                $pricing = $this->pricingService->calculate(
                    $schedule,
                    $user,
                    $totalPassengers,
                    $data->promo_code
                );

                $bookingCode = 'BKG-' . strtoupper(Str::random(8));

                $booking = Booking::create([
                    'booking_code' => $bookingCode,
                    'user_id' => $user->id,
                    'schedule_id' => $schedule->id,
                    'promotion_id' => $pricing['promotion_id'],
                    'subtotal' => $pricing['subtotal'],
                    'discount_amount' => $pricing['discount_amount'],
                    'total_amount' => $pricing['total_amount'],
                    'total_passengers' => $totalPassengers,
                    'payment_status' => 'PENDING',
                    'expires_at' => now()->addMinutes(60),
                ]);

                foreach ($data->passengers as $pax) {
                    $booking->passengers()->create([
                        'full_name' => $pax->full_name,
                        'identity_number' => $pax->identity_number,
                        'whatsapp' => $pax->whatsapp,
                        'email' => $pax->email,
                        'gender' => $pax->gender,
                        'price' => $pricing['price_per_pax'],
                        'is_free_ticket' => false,
                    ]);
                }

                $schedule->decrement('available_seats', $totalPassengers);

                // Payment will be initiated by user on payment page
                // $this->paymentService->createInvoice($booking);

                return $booking;
            });
        });
    }
}
