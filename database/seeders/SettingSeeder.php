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
                'value' => 'Pinisi Kendari',
                'type' => 'text',
                'group' => 'general',
            ],
            [
                'key' => 'app_logo',
                'label' => 'Logo Aplikasi',
                'value' => null, // Admin needs to upload this. Frontend handles null with fallback.
                'type' => 'image',
                'group' => 'general',
            ],
            [
                'key' => 'app_description',
                'label' => 'Deskripsi Aplikasi',
                'value' => 'Platform booking trip kapal #1 di kendari!.',
                'type' => 'textarea',
                'group' => 'general',
            ],

            // [Group: Landing]
            [
                'key' => 'hero_badge',
                'label' => 'Hero Badge Text',
                'value' => '100+ jadwal tersedia hari ini',
                'type' => 'text',
                'group' => 'landing',
            ],
            [
                'key' => 'hero_title',
                'label' => 'Hero Title',
                'value' => 'Jelajahi Surga di Kendari tanpa batas',
                'type' => 'text',
                'group' => 'landing',
            ],
            [
                'key' => 'hero_subtitle',
                'label' => 'Hero Subtitle',
                'value' => 'Pesan tiket trip kapal dengan mudah dan nikmati liburanmu diatas kapal pinisi.',
                'type' => 'textarea',
                'group' => 'landing',
            ],
            [
                'key' => 'hero_image',
                'label' => 'Hero Image',
                'value' => null,
                'type' => 'image',
                'group' => 'landing',
            ],
            [
                'key' => 'hero_cta_text',
                'label' => 'Hero CTA Text',
                'value' => 'Cari Jadwal',
                'type' => 'text',
                'group' => 'landing',
            ],
            [
                'key' => 'hero_stats',
                'label' => 'Hero Statistics (JSON)',
                'value' => json_encode([
                    ['value' => '50K+', 'label' => 'Penumpang Puas'],
                    ['value' => '4.9', 'label' => 'Rating Pengguna'],
                    ['value' => '15+', 'label' => 'Rute Tersedia'],
                ]),
                'type' => 'json',
                'group' => 'landing',
            ],
            [
                'key' => 'landing_features',
                'label' => 'Fitur Unggulan (JSON)',
                'value' => json_encode([
                    ['icon' => 'QrCode', 'title' => 'Digital Boarding Pass', 'description' => 'Tidak perlu cetak tiket. Cukup tunjukkan QR code dari handphone Anda saat boarding.'],
                    ['icon' => 'Shield', 'title' => 'Jaminan Uang Kembali', 'description' => 'Refund 100% jika pembatalan oleh operator.'],
                    ['icon' => 'Ship', 'title' => 'Armada Premium', 'description' => 'Kapal modern dengan fasilitas VIP terbaik.'],
                    ['icon' => 'Map', 'title' => 'Real-time Tracking', 'description' => 'Pantau posisi kapal secara langsung melalui GPS tracking di aplikasi kami.'],
                ]),
                'type' => 'json',
                'group' => 'landing',
            ],
            [
                'key' => 'landing_testimonials',
                'label' => 'Testimoni Pelanggan (JSON)',
                'value' => json_encode([
                    ['name' => 'Andi Saputra', 'text' => 'Booking cepat, langsung dapat e-ticket. Praktis buat liburan keluarga!', 'avatar' => '👨‍💼'],
                    ['name' => 'Siti Noor', 'text' => 'Harga transparan dan pelayanannya sangat memuaskan. Recommended!', 'avatar' => '👩‍🦰'],
                    ['name' => 'Budi Santoso', 'text' => 'Kapalnya bersih dan tepat waktu. Pengalaman yang luar biasa.', 'avatar' => '👨‍🔬'],
                    ['name' => 'Dewi Lestari', 'text' => 'Sangat membantu untuk pesan tiket antar pulau di Sulawesi.', 'avatar' => '👩‍🎓'],
                ]),
                'type' => 'json',
                'group' => 'landing',
            ],
            [
                'key' => 'landing_cta',
                'label' => 'CTA Bottom Section (JSON)',
                'value' => json_encode([
                    'headline' => 'Siap Memulai Petualanganmu?',
                    'subheadline' => 'Pesan tiketmu sekarang dan nikmati keindahan alam Sulawesi yang memukau',
                    'primary_button' => 'Pesan Tiket Sekarang',
                    'secondary_button' => 'Hubungi Kami',
                ]),
                'type' => 'json',
                'group' => 'landing',
            ],
            [
                'key' => 'landing_social_proof_title',
                'label' => 'Judul Social Proof',
                'value' => 'Dipercaya oleh operator terbaik di Indonesia',
                'type' => 'text',
                'group' => 'landing',
            ],
            [
                'key' => 'landing_social_proof_clients',
                'label' => 'Daftar Klien/Operator (JSON)',
                'value' => json_encode([
                    ['name' => 'Pelni', 'logo' => '🚢'],
                    ['name' => 'ASDP', 'logo' => '⛴️'],
                    ['name' => 'Dharma Lautan', 'logo' => '🛳️'],
                    ['name' => 'Express Bahari', 'logo' => '🚤'],
                    ['name' => 'Sindo Ferry', 'logo' => '⚓'],
                    ['name' => 'Blue Sea Jet', 'logo' => '🌊'],
                ]),
                'type' => 'json',
                'group' => 'landing',
            ],

            // [Group: Contact]
            [
                'key' => 'contact_email',
                'label' => 'Email Kontak',
                'value' => 'info@kapaltrip.id',
                'type' => 'text',
                'group' => 'contact',
            ],
            [
                'key' => 'contact_whatsapp',
                'label' => 'WhatsApp Kontak',
                'value' => '6281234567890',
                'type' => 'text',
                'group' => 'contact',
            ],
            [
                'key' => 'social_instagram',
                'label' => 'Link Instagram',
                'value' => 'https://instagram.com/kapaltrip',
                'type' => 'text',
                'group' => 'contact',
            ],
            [
                'key' => 'social_facebook',
                'label' => 'Link Facebook',
                'value' => 'https://facebook.com/kapaltrip',
                'type' => 'text',
                'group' => 'contact',
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
