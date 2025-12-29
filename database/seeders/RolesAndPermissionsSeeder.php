<?php


namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Define Permissions (Granular)
        // Daftar Permission untuk Seeder
        $permissions = [
            // Dashboard
            'dashboard.view-admin',
            'dashboard.view-operator',
            'dashboard.view-customer',
            'dashboard.analytics',

            // Master Data
            'branches.view-any',
            'branches.view',
            'branches.create',
            'branches.update',
            'branches.delete',
            'ships.view-any',
            'ships.view',
            'ships.create',
            'ships.update',
            'ships.delete',
            'routes.view-any',
            'routes.view',
            'routes.create',
            'routes.update',
            'routes.delete',
            'routes.manage-waypoints',
            'trip-types.manage',

            // Pricing & Promo
            'pricelists.view-any',
            'pricelists.manage',
            'pricelists.view',
            'pricelists.create',
            'pricelists.update',
            'pricelists.delete',
            'promotions.view-any',
            'promotions.create',
            'promotions.update',
            'promotions.delete',

            // Schedules
            'schedules.view-any',
            'schedules.view',
            'schedules.create',
            'schedules.update',
            'schedules.delete',
            'schedules.manage-seats',

            // Bookings & Transactions
            'bookings.view-any',
            'bookings.view',
            'bookings.create',
            'bookings.update',
            'bookings.cancel',
            'bookings.refund',
            'bookings.view-self',
            'payments.view-any',
            'payments.view',
            'payments.approve',
            'payments.void',

            // Scanning
            'scan.view',
            'scan.process',
            'scan.history',

            // Expenses
            'expenses.view-any',
            'expenses.view',
            'expenses.create',
            'expenses.approve',
            'expenses.reject',
            'expense-categories.manage',

            // Reports
            'reports.view',
            'reports.export',
            'reports.sales',
            'reports.manifest',
            'reports.financial',

            // Users & Settings
            'users.view-any',
            'users.view',
            'users.create',
            'users.update',
            'users.delete',
            'users.assign-role',
            'users.assign-branch',
            'settings.view',
            'settings.update',
            'audit-logs.view',

            // Roles & Permissions
            'roles.view-any',
            'roles.view',
            'roles.create',
            'roles.update',
            'roles.delete',
            'permissions.view',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 2. Define Roles & Assign Permissions

        // --- CUSTOMER ---
        $customerRole = Role::firstOrCreate(['name' => 'customer']);
        $customerRole->givePermissionTo([
            'dashboard.view-customer',
            'schedules.view-any', // search_tickets
            'bookings.create',
            'bookings.view-self', // view_booking_history
        ]);

        // --- OPERATOR ---
        $operatorRole = Role::firstOrCreate(['name' => 'operator']);
        $operatorRole->givePermissionTo([
            'dashboard.view-operator',
            'scan.view',
            'scan.process', // scan_tickets
            'scan.history', // view_scan_history
        ]);

        // --- ADMIN ---
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all()); // Admin gets everything

        // --- SUPER ADMIN (Optional, bypasses all checks via Gate usually) ---
        Role::firstOrCreate(['name' => 'super-admin']);
    }
}
