<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
        'gateway_response' => 'array', // Auto convert JSON ke Array
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
