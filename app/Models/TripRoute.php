<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TripRoute extends Model
{
    use SoftDeletes;

    protected $guarded = ['id'];

    protected $casts = [
        'waypoints' => 'array', // Otomatis convert JSON ke Array PHP
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    // Rute ini punya banyak variasi harga
    public function pricelists()
    {
        return $this->hasMany(Pricelist::class);
    }
}
