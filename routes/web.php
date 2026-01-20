<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Admin\ScheduleController;
use App\Http\Controllers\Customer\BookingController;
use Inertia\Inertia;

// Public Routes
Route::get('/', function () {
    $routes = \App\Models\TripRoute::with('branch')
        ->where('status', 'ACTIVE')
        ->take(3)
        ->get();

    return Inertia::render('homepage/welcome', [
        'routes' => $routes,
    ]);
})->name('home');
// Authentication routes handled by Fortify (see FortifyServiceProvider.php)
// Login view: resources/js/pages/auth/login.tsx
// Login redirect logic: app/Http/Responses/LoginResponse.php
Route::post('logout', [LoginController::class, 'destroy'])->name('logout');

// Public Booking Routes (Browse schedules without login)
Route::get('/booking', [BookingController::class, 'index'])->name('booking.index');
Route::get('/booking/create/{schedule}', [BookingController::class, 'create'])->name('booking.create');

// Development Routes (Payment Simulation)
Route::get('/dev/payment-simulation', [\App\Http\Controllers\Api\PaymentController::class, 'simulation'])->name('dev.payment.simulation');
Route::post('/dev/payment-simulation', [\App\Http\Controllers\Api\PaymentController::class, 'simulate'])->name('dev.payment.simulate');


// Authenticated Routes
Route::middleware('auth')->group(function () {

    // --- AREA CUSTOMER ---
    // Role: Customer (dan Admin boleh akses utk testing)
    Route::middleware(['role:customer|admin|super-admin'])->group(function () {
        // Booking submission requires login
        Route::post('/booking', [BookingController::class, 'store'])->name('booking.store');

        // Detail Booking menggunakan Policy 'can:view,booking'
        Route::get('/booking/{booking:booking_code}', [BookingController::class, 'payment'])
            ->name('booking.payment')
            ->can('view', 'booking'); // Laravel otomatis cek BookingPolicy::view

        Route::get('/booking/{booking:booking_code}/ticket', [BookingController::class, 'downloadTicket'])
            ->name('booking.ticket')
            ->can('view', 'booking');
    });

    // --- AREA ADMIN ---
    Route::prefix('admin')->name('admin.')->middleware(['role:admin|super-admin'])->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

        // Resource Controller untuk Schedule
        Route::post('schedules/bulk', [ScheduleController::class, 'bulkStore'])->name('schedules.bulk-store');
        Route::resource('schedules', ScheduleController::class);

        // MASTER DATA ROUTES
        Route::post('branches/switch', [\App\Http\Controllers\Admin\BranchController::class, 'switch'])->name('branches.switch');
        Route::resource('branches', \App\Http\Controllers\Admin\BranchController::class);
        Route::resource('ships', \App\Http\Controllers\Admin\ShipController::class);

        // Perhatikan parameter binding di controller TripRouteController tadi
        // Laravel defaultnya resource param jadi trip_route (snake case dari nama model)
        Route::resource('trip-routes', \App\Http\Controllers\Admin\TripRouteController::class)
            ->parameters(['trip-routes' => 'tripRoute']);

        Route::resource('pricelists', \App\Http\Controllers\Admin\PricelistController::class);

        // Booking Management (Admin)
        Route::resource('bookings', \App\Http\Controllers\Admin\BookingController::class)->only(['index', 'show', 'destroy']);

        // Expense Management
        Route::resource('expenses', \App\Http\Controllers\Admin\ExpenseController::class);

        // Payment Management (Admin) - Xendit Integration
        Route::resource('payments', \App\Http\Controllers\Admin\PaymentController::class)->only(['index', 'show']);

        // RBAC / User Management
        Route::resource('users', \App\Http\Controllers\Admin\UserController::class);
        Route::resource('roles', \App\Http\Controllers\Admin\RoleController::class)->only(['index', 'update']);

        // Settings
        Route::get('settings', [\App\Http\Controllers\Admin\SettingController::class, 'index'])->name('settings.index');
        Route::put('settings', [\App\Http\Controllers\Admin\SettingController::class, 'update'])->name('settings.update');
    });

    // --- AREA OPERATOR ---
    Route::prefix('operator')->name('operator.')->middleware(['role:operator|super-admin'])->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('operator/dashboard/index');
        })->name('dashboard');

        // Route Scan (Nanti dibuat)
        // Route::get('/scan', [ScanController::class, 'index'])->name('scan.index');
    });
});
