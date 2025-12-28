<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pricelist extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'price_public' => 'decimal:2',
        'price_event' => 'decimal:2',
        'effective_from' => 'date',
        'effective_until' => 'date',
        'is_active' => 'boolean',
    ];

    public function tripRoute()
    {
        return $this->belongsTo(TripRoute::class);
    }

    public function tripType()
    {
        return $this->belongsTo(TripType::class);
    }
}
