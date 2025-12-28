<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'operator']);
    }

    public function view(User $user, Booking $booking): bool
    {
        // 1. Admin: Boleh lihat semua
        if ($user->hasRole('admin')) return true;

        // 2. Customer: Hanya boleh lihat booking miliknya sendiri
        if ($user->hasRole('customer')) {
            return $user->id === $booking->user_id;
        }

        // 3. Operator: Hanya boleh lihat jika keberangkatan dari cabangnya
        if ($user->hasRole('operator')) {
            // Eager loading check di controller penting, tapi di sini kita lazy load safety net
            return $booking->schedule->route->branch_id === $user->branch_id;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->hasRole(['customer', 'admin']); // Operator biasanya cuma scan
    }

    // Siapa yang boleh scan tiket ini?
    // Ini Custom Policy Action
    public function scan(User $user, Booking $booking): bool
    {
        if (!$user->hasRole('operator')) return false;

        // Pastikan tiket ini berangkat dari cabang si operator
        return $booking->schedule->route->branch_id === $user->branch_id;
    }
}
