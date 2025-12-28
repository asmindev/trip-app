<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingPassenger extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'scanned_at' => 'datetime',
        'is_free_ticket' => 'boolean',
        'price' => 'decimal:2',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
