<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Branch;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Super Admin (Bisa akses semua cabang)
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@kapaltrip.com',
            'password' => Hash::make('password'),
            'role' => 'ADMIN',
            'account_type' => 'PUBLIC',
            'phone_number' => '081234567890',
            'branch_id' => null, // Admin tidak terikat cabang
        ]);

        // 2. Operator Kendari (Hanya bisa scan tiket Kendari)
        $kendari = Branch::where('code', 'KDI')->first();
        User::create([
            'name' => 'Operator Kendari',
            'email' => 'op.kendari@kapaltrip.com',
            'password' => Hash::make('password'),
            'role' => 'OPERATOR',
            'account_type' => 'PUBLIC',
            'phone_number' => '081299998888',
            'branch_id' => $kendari->id, // Terikat cabang
        ]);

        // 3. Customer Public
        User::create([
            'name' => 'Jhon Doe',
            'email' => 'customer@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'CUSTOMER',
            'account_type' => 'PUBLIC',
            'phone_number' => '085255554444',
            'branch_id' => null,
        ]);

        // 4. Customer Event (Akun Khusus)
        User::create([
            'name' => 'Panitia Gathering',
            'email' => 'event@perusahaan.com',
            'password' => Hash::make('password'),
            'role' => 'CUSTOMER',
            'account_type' => 'EVENT', // Dapat harga spesial
            'phone_number' => '08111222333',
        ]);
    }
}
