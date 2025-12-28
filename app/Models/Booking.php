<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use SoftDeletes;

    protected $guarded = ['id']; // Allow mass assignment except ID

    protected $casts = [
        'booking_date' => 'date',
        'paid_at' => 'datetime',
        'expires_at' => 'datetime',
        'total_amount' => 'decimal:2',
    ];

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Jadwal
    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }

    // Relasi ke Penumpang (One to Many)
    public function passengers()
    {
        return $this->hasMany(BookingPassenger::class);
    }

    // Relasi ke Pembayaran (One to One)
    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
