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

    protected $appends = ['qr_image'];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function getQrImageAttribute()
    {
        if ($this->payment_type === 'QR_CODE' && $this->payment_code) {
             return app(\App\Services\PaymentService::class)->generateQrCodeImage($this->payment_code);
        }
        return null;
    }
}
