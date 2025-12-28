<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ship extends Model
{
    use SoftDeletes;

    protected $guarded = ['id'];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    // Kapal punya banyak jadwal keberangkatan
    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
}
