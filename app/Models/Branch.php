<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Branch extends Model
{
    use SoftDeletes;

    protected $guarded = ['id'];

    // Relasi: Satu cabang punya banyak user (Operator)
    public function users()
    {
        return $this->hasMany(User::class);
    }

    // Relasi: Satu cabang punya banyak kapal
    public function ships()
    {
        return $this->hasMany(Ship::class);
    }

    // Relasi: Satu cabang punya banyak rute
    public function tripRoutes()
    {
        return $this->hasMany(TripRoute::class);
    }
}
