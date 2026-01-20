<?php

namespace App\Console\Commands;

use App\Models\Booking;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExpireBookings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'booking:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Expire pending bookings that have passed their expiration time';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $expiredBookings = Booking::where('payment_status', 'PENDING')
            ->where('expires_at', '<', now())
            ->with('schedule')
            ->get();

        $count = 0;

        foreach ($expiredBookings as $booking) {
            try {
                DB::transaction(function () use ($booking) {
                    // Lock for update to avoid race condition with late payment
                    $booking = Booking::lockForUpdate()->find($booking->id);

                    if ($booking->payment_status !== 'PENDING') {
                        return; // Already processed
                    }

                    $booking->update(['payment_status' => 'EXPIRED']);

                    // Release seats
                    if ($booking->schedule) {
                         $booking->schedule()->increment('available_seats', $booking->total_passengers);
                    }

                    // Expire related payment
                    if ($booking->payment) {
                        $booking->payment->update(['status' => 'EXPIRED']);
                    }

                    Log::info("Booking expired automatically: {$booking->booking_code}");
                });
                $count++;
            } catch (\Exception $e) {
                Log::error("Failed to expire booking {$booking->booking_code}: " . $e->getMessage());
            }
        }

        $this->info("Expired $count bookings.");
    }
}
