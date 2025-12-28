<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $guarded = ['id'];

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // Helper untuk mengambil value dengan tipe data yang benar
    // Contoh penggunaan: Setting::find(1)->formatted_value
    public function getFormattedValueAttribute()
    {
        return match ($this->type) {
            'boolean' => (bool) $this->value,
            'number' => (float) $this->value,
            'json' => json_decode($this->value, true),
            default => $this->value,
        };
    }
}
