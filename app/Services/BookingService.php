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
use Xendit\Configuration;
use Xendit\Invoice\InvoiceApi;
use Xendit\Invoice\CreateInvoiceRequest;
use Exception;

class BookingService
{
    public function __construct(
        protected PricingService $pricingService
    ) {
        // Setup Xendit Global Config
        Configuration::setXenditKey(config('services.xendit.secret_key'));
    }

    public function createBooking(User $user, CreateBookingData $data): Booking
    {
        $totalPassengers = count($data->passengers);
        $lockKey = "booking_lock:schedule:{$data->schedule_id}";

        // 1. REDIS ATOMIC LOCK (Wait 5 seconds, Lock 10 seconds)
        // Mencegah 2 orang booking kursi terakhir bersamaan
        return Cache::lock($lockKey, 10)->block(5, function () use ($user, $data, $totalPassengers) {

            return DB::transaction(function () use ($user, $data, $totalPassengers) {

                // 2. PESSIMISTIC LOCK (Database Row Lock)
                // Memastikan data kursi yang dibaca adalah yang paling update
                $schedule = Schedule::lockForUpdate()->find($data->schedule_id);

                if (!$schedule) {
                    throw new Exception("Jadwal tidak ditemukan.");
                }

                // 3. Validasi Ketersediaan Kursi
                if ($schedule->available_seats < $totalPassengers) {
                    throw new Exception("Mohon maaf, sisa kursi tidak mencukupi. Tersisa: {$schedule->available_seats}");
                }

                // 4. Hitung Harga (Panggil PricingService)
                $pricing = $this->pricingService->calculate(
                    $schedule,
                    $user,
                    $totalPassengers,
                    $data->promo_code
                );

                // 5. Simpan Header Booking
                $bookingCode = 'BKG-' . strtoupper(Str::random(8)); // Bisa diganti format tanggal

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
                    'expires_at' => now()->addMinutes(60), // Batas waktu bayar 1 jam
                ]);

                // 6. Simpan Detail Penumpang
                foreach ($data->passengers as $pax) {
                    $booking->passengers()->create([
                        'full_name' => $pax->full_name,
                        'identity_number' => $pax->identity_number,
                        'gender' => $pax->gender,
                        'price' => $pricing['price_per_pax'], // Harga satuan saat booking terjadi
                        'is_free_ticket' => false, // TODO: Logic detail Buy X Get Y bisa disini
                    ]);
                }

                // 7. KURANGI KURSI (Atomic Decrement)
                $schedule->decrement('available_seats', $totalPassengers);

                // 8. CREATE XENDIT INVOICE
                $invoice = $this->createXenditInvoice($user, $booking);

                // 9. Simpan Record Payment
                Payment::create([
                    'booking_id' => $booking->id,
                    'external_id' => $booking->booking_code, // Reference ID Xendit
                    'xendit_id' => $invoice['id'],
                    'checkout_url' => $invoice['invoice_url'],
                    'status' => 'PENDING',
                    'amount' => $pricing['total_amount'],
                    'gateway_response' => $invoice // Simpan log raw response
                ]);

                return $booking;
            });
        });
    }

    /**
     * Helper Private untuk Call Xendit API
     */
    private function createXenditInvoice(User $user, Booking $booking)
    {
        $apiInstance = new InvoiceApi();

        $params = new CreateInvoiceRequest([
            'external_id' => $booking->booking_code,
            'amount' => $booking->total_amount,
            'description' => "Tiket Kapal Trip #{$booking->booking_code}",
            'invoice_duration' => 3600, // 1 Jam (detik)
            'customer' => [
                'given_names' => $user->name,
                'email' => $user->email,
                'mobile_number' => $user->phone_number ?? '-'
            ],
            'success_redirect_url' => route('booking.payment', $booking->booking_code),
            'failure_redirect_url' => route('booking.index'),
            'currency' => 'IDR',
        ]);

        try {
            $result = $apiInstance->createInvoice($params);
            return json_decode(json_encode($result), true); // Convert Object to Array
        } catch (\Xendit\XenditSdkException $e) {
            throw new Exception('Gagal membuat Invoice Xendit: ' . $e->getMessage());
        }
    }
}
