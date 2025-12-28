<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScanLog extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'scanned_at' => 'datetime',
    ];

    public function passenger()
    {
        return $this->belongsTo(BookingPassenger::class, 'booking_passenger_id');
    }

    public function operator()
    {
        return $this->belongsTo(User::class, 'operator_id');
    }
}
