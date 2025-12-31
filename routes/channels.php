<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('payment.{bookingCode}', function ($user, $bookingCode) {
    $booking = \App\Models\Booking::where('booking_code', $bookingCode)->first();
    return $booking && ((int) $user->id === (int) $booking->user_id || $user->hasRole(['admin', 'super-admin']));
});
