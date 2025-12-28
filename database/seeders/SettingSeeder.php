<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // [Group: General]
            [
                'key' => 'app_name',
                'label' => 'Nama Aplikasi',
                'value' => 'Kapal Trip',
                'type' => 'text',
                'group' => 'general',
            ],
            [
                'key' => 'contact_wa',
                'label' => 'Nomor WhatsApp Admin',
                'value' => '6281234567890',
                'type' => 'text',
                'group' => 'general',
            ],

            // [Group: Booking]
            [
                'key' => 'booking_timeout_minutes',
                'label' => 'Batas Waktu Pembayaran (Menit)',
                'value' => '60', // 1 Jam default
                'type' => 'number',
                'group' => 'booking',
            ],
            [
                'key' => 'refund_max_hours_before',
                'label' => 'Batas Maksimal Refund (Jam sebelum berangkat)',
                'value' => '24', // H-1
                'type' => 'number',
                'group' => 'booking',
            ],

            // [Group: Xendit Payment]
            [
                'key' => 'enable_payment_gateway',
                'label' => 'Aktifkan Pembayaran Online',
                'value' => '1', // True
                'type' => 'boolean',
                'group' => 'payment',
            ],
            [
                'key' => 'xendit_mode',
                'label' => 'Mode Xendit (Development/Production)',
                'value' => 'development',
                'type' => 'text',
                'group' => 'payment',
            ],
        ];

        DB::table('settings')->insert($settings);
    }
}
