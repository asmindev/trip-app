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
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@trip.com',
            'password' => Hash::make('password'),
            'role' => 'ADMIN',
            'account_type' => 'PUBLIC',
            'phone_number' => '081234567890',
            'branch_id' => null, // Admin tidak terikat cabang
        ]);
        $superAdmin->assignRole('super-admin');

        // admin
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@trip.com',
            'password' => Hash::make('password'),
            'role' => 'ADMIN',
            'account_type' => 'PUBLIC',
            'phone_number' => '081234567890',
            'branch_id' => null, // Admin tidak terikat cabang
        ]);
        $admin->assignRole('admin');



        // 2. Operator Kendari (Hanya bisa scan tiket Kendari)
        $kendari = Branch::where('code', 'KDI')->first();
        $operator = User::create([
            'name' => 'Operator Kendari',
            'email' => 'op.kendari@trip.com',
            'password' => Hash::make('password'),
            'role' => 'OPERATOR',
            'account_type' => 'PUBLIC',
            'phone_number' => '081299998888',
            'branch_id' => $kendari ? $kendari->id : null, // Terikat cabang
        ]);
        $operator->assignRole('operator');

        // 3. Customer Public
        $customer = User::create([
            'name' => 'Jhon Doe',
            'email' => 'customer@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'CUSTOMER',
            'account_type' => 'PUBLIC',
            'phone_number' => '085255554444',
            'branch_id' => null,
        ]);
        $customer->assignRole('customer');

        // 4. Customer Event (Akun Khusus)
        $eventCustomer = User::create([
            'name' => 'Panitia Gathering',
            'email' => 'event@perusahaan.com',
            'password' => Hash::make('password'),
            'role' => 'CUSTOMER',
            'account_type' => 'EVENT', // Dapat harga spesial
            'phone_number' => '08111222333',
        ]);
    }
}
