<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;

class Schedule extends Model
{
    use SoftDeletes;

    protected $guarded = ['id'];

    protected $casts = [
        'departure_date' => 'date',
        // departure_time is usually stored as H:i:s
    ];

    protected $appends = ['arrival_time'];

    // --- RELATIONSHIPS ---

    public function route()
    {
        return $this->belongsTo(TripRoute::class, 'trip_route_id');
    }

    public function ship()
    {
        return $this->belongsTo(Ship::class);
    }

    public function tripType()
    {
        return $this->belongsTo(TripType::class);
    }

    // --- ACCESSORS ---

    /**
     * Calculate Arrival Time based on Route Duration
     */
    protected function arrivalTime(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->departure_date || !$this->departure_time || !$this->route) {
                    return null;
                }

                $duration = $this->route->duration_minutes ?? 0;

                // Combine date and time
                $departure = Carbon::parse($this->departure_date->format('Y-m-d') . ' ' . $this->departure_time);

                return $departure->addMinutes($duration)->format('Y-m-d H:i:s');
            }
        );
    }

    // --- SCOPES ---

    public function scopeActive($query)
    {
        // Future schedules or today's schedules that haven't departed yet (simplification: just date >= today)
        return $query->where('departure_date', '>=', Carbon::today())
                     ->whereIn('status', ['SCHEDULED']);
    }

    public function scopeByBranch($query, $branchId)
    {
        return $query->whereHas('route', function ($q) use ($branchId) {
            $q->where('branch_id', $branchId);
        });
    }

    public function scopeAvailable($query)
    {
        return $query->where('status', 'SCHEDULED')
            ->where('available_seats', '>', 0)
            ->where('departure_date', '>=', Carbon::today());
    }
}
