<?php

namespace App\Services;

use App\Models\Schedule;
use App\Models\User;
use App\Models\Promotion;
use Brick\Money\Money;
use Brick\Math\RoundingMode;

class PricingService
{
    /**
     * Hitung total harga, diskon, dan grand total
     */
    public function calculate(Schedule $schedule, User $user, int $passengerCount, ?string $promoCode = null): array
    {
        // 1. Ambil Pricelist Aktif
        $pricelist = $schedule->route->pricelists()
            ->where('trip_type_id', $schedule->trip_type_id)
            ->where('is_active', true)
            ->whereDate('effective_from', '<=', now())
            ->firstOrFail();

        // 2. Tentukan Harga Dasar (Public vs Event)
        // Menggunakan Brick\Money agar presisi
        $basePriceAmount = ($user->account_type === 'EVENT')
            ? $pricelist->price_event
            : $pricelist->price_public;

        $pricePerPax = Money::of($basePriceAmount, 'IDR');
        $subtotal = $pricePerPax->multipliedBy($passengerCount);

        // 3. Cek Promo (Jika ada)
        $discountAmount = Money::of(0, 'IDR');
        $promoId = null;

        if ($promoCode) {
            $promo = Promotion::where('code', $promoCode)
                ->where('is_active', true)
                ->whereDate('valid_until', '>=', now())
                ->first();

            if ($promo) {
                $promoId = $promo->id;

                if ($promo->type === 'DISCOUNT_AMOUNT') {
                    // Potongan Nominal (Rp 50.000)
                    $discountAmount = Money::of($promo->value, 'IDR');
                } elseif ($promo->type === 'DISCOUNT_PERCENT') {
                    // Potongan Persen (10%)
                    $discountAmount = $subtotal->multipliedBy($promo->value / 100, RoundingMode::HALF_DOWN);
                } elseif ($promo->type === 'BUY_X_GET_Y') {
                    // Logic Buy 10 Get 1
                    if ($passengerCount >= $promo->min_qty) {
                        // Hitung berapa tiket gratis
                        $freeTickets = floor($passengerCount / $promo->min_qty) * $promo->value;
                        $discountAmount = $pricePerPax->multipliedBy($freeTickets);
                    }
                }
            }
        }

        // 4. Hitung Total Akhir
        $totalAmount = $subtotal->minus($discountAmount);

        // Return values raw (string/float) untuk disimpan ke DB
        return [
            'price_per_pax' => $pricePerPax->getAmount()->toFloat(),
            'subtotal' => $subtotal->getAmount()->toFloat(),
            'discount_amount' => $discountAmount->getAmount()->toFloat(),
            'total_amount' => $totalAmount->getAmount()->toFloat(), // Pastikan tidak negatif
            'promotion_id' => $promoId,
        ];
    }
}
