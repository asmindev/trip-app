<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Scopes\BranchScope; // Nanti kita buat scope ini

class Schedule extends Model
{
    use SoftDeletes;

    protected $guarded = ['id'];

    protected $casts = [
        'departure_date' => 'date',
        'departure_time' => 'datetime', // atau string H:i
    ];

    public function route()
    {
        return $this->belongsTo(TripRoute::class, 'trip_route_id');
    }

    public function ship()
    {
        return $this->belongsTo(Ship::class);
    }

    // Scope untuk filter active
    public function scopeAvailable($query)
    {
        return $query->where('status', 'SCHEDULED')
            ->where('available_seats', '>', 0);
    }
}
