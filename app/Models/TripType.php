<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TripType extends Model
{
    protected $guarded = ['id'];

    // Relasi ke Pricelist
    public function pricelists()
    {
        return $this->hasMany(Pricelist::class);
    }
}
