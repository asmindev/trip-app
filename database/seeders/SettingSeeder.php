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

            // [Group: Homepage]
            [
                'key' => 'homepage_hero',
                'label' => 'Hero Section',
                'value' => json_encode([
                    'badge' => '100+ jadwal tersedia hari ini',
                    'headline' => 'Jelajahi Surga Tersembunyi Indonesia',
                    'subheadline' => 'Pesan tiket kapal ke pulau-pulau eksotis Indonesia dengan mudah. Cepat, aman, dan terpercaya.',
                    'stats' => [
                        ['value' => '50K+', 'label' => 'Penumpang Puas'],
                        ['value' => '4.9', 'label' => 'Rating Pengguna'],
                        ['value' => '15+', 'label' => 'Rute Tersedia'],
                    ],
                ]),
                'type' => 'json',
                'group' => 'homepage',
            ],
            [
                'key' => 'homepage_features',
                'label' => 'Fitur Unggulan',
                'value' => json_encode([
                    ['icon' => 'Zap', 'title' => 'Booking Instan', 'description' => 'Pesan tiket dalam hitungan detik'],
                    ['icon' => 'Shield', 'title' => 'Jaminan Aman', 'description' => 'Pembayaran terenkripsi 100%'],
                    ['icon' => 'CreditCard', 'title' => 'Bayar Mudah', 'description' => 'QRIS, E-wallet, Transfer Bank'],
                    ['icon' => 'Headphones', 'title' => 'Support 24/7', 'description' => 'Tim siap membantu kapanpun'],
                ]),
                'type' => 'json',
                'group' => 'homepage',
            ],
            [
                'key' => 'homepage_testimonials',
                'label' => 'Testimoni Pelanggan',
                'value' => json_encode([
                    ['name' => 'Andi S.', 'text' => 'Booking cepat, langsung dapat e-ticket. Praktis!', 'avatar' => '👨‍💼'],
                    ['name' => 'Siti N.', 'text' => 'Harga lebih murah + dapat promo 20%! 🔥', 'avatar' => '👩‍🦰'],
                    ['name' => 'Budi S.', 'text' => 'Customer service responsif banget. Recommended!', 'avatar' => '👨‍🔬'],
                    ['name' => 'Dewi L.', 'text' => 'Liburan jadi gampang. Tinggal pilih, bayar, selesai.', 'avatar' => '👩‍🎓'],
                    ['name' => 'Rizky M.', 'text' => 'Sudah 5x booking. Tidak pernah ada masalah.', 'avatar' => '👨‍🎨'],
                    ['name' => 'Putri A.', 'text' => 'App-nya user friendly. Dark mode keren!', 'avatar' => '👩‍💻'],
                ]),
                'type' => 'json',
                'group' => 'homepage',
            ],
            [
                'key' => 'homepage_cta',
                'label' => 'Call to Action',
                'value' => json_encode([
                    'headline' => 'Siap Memulai Petualanganmu?',
                    'subheadline' => 'Pesan tiketmu sekarang dan nikmati keindahan alam Sulawesi',
                    'primary_button' => 'Pesan Tiket',
                    'secondary_button' => 'Hubungi Kami',
                ]),
                'type' => 'json',
                'group' => 'homepage',
            ],
        ];

        foreach ($settings as $setting) {
            DB::table('settings')->updateOrInsert(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
