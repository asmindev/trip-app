<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\DataCollectionOf;

class CreateBookingData extends Data
{
    public function __construct(
        public int $schedule_id,

        #[DataCollectionOf(BookingPassengerData::class)]
        public array $passengers,

        public ?string $promo_code = null,
    ) {}
}
