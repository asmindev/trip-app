<?php

namespace App\Data;

use App\Enums\Gender;
use Spatie\LaravelData\Data;

class BookingPassengerData extends Data
{
    public function __construct(
        public string $full_name,
        public ?string $identity_number,
        public string $whatsapp,
        public ?string $email,
        public Gender $gender,
    ) {}
}
