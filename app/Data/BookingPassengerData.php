<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class BookingPassengerData extends Data
{
    public function __construct(
        public string $full_name,
        public ?string $identity_number,
        public ?string $gender, // L/P
    ) {}
}
