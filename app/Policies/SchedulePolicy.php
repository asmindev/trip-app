<?php

namespace App\Policies;

use App\Models\Schedule;
use App\Models\User;

class SchedulePolicy
{
    // Siapa yang boleh lihat daftar jadwal di Admin Panel?
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'operator']);
    }

    // Siapa yang boleh lihat detail jadwal tertentu?
    public function view(User $user, Schedule $schedule): bool
    {
        if ($user->hasRole('admin')) return true;

        // Operator: Hanya jika jadwal tersebut milik cabang yang sama dengan user
        if ($user->hasRole('operator')) {
            // Kita perlu load relasi route->branch untuk cek
            // Asumsi: Schedule -> TripRoute -> Branch
            return $schedule->route->branch_id === $user->branch_id;
        }

        return false;
    }

    // Create/Update/Delete hanya Admin
    public function create(User $user): bool
    {
        return $user->hasRole('admin'); // Atau check permission 'schedules.create'
    }

    public function update(User $user, Schedule $schedule): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, Schedule $schedule): bool
    {
        return $user->hasRole('admin');
    }
}
