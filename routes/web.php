<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Admin\ScheduleController;
use App\Http\Controllers\Customer\BookingController;
use Inertia\Inertia;

// Public Routes
Route::get('/', function () {
    return Inertia::render('homepage/welcome');
})->name('home');
Route::get('login', [LoginController::class, 'create'])->name('login');
Route::post('login', [LoginController::class, 'store']);
Route::post('logout', [LoginController::class, 'destroy'])->name('logout');

// Authenticated Routes
Route::middleware('auth')->group(function () {

    // --- AREA CUSTOMER ---
    // Role: Customer (dan Admin boleh akses utk testing)
    Route::middleware(['role:customer|admin|super-admin'])->group(function () {
        Route::get('/booking', [BookingController::class, 'index'])->name('booking.index');
        Route::get('/booking/create/{schedule}', [BookingController::class, 'create'])->name('booking.create');
        Route::post('/booking', [BookingController::class, 'store'])->name('booking.store');

        // Detail Booking menggunakan Policy 'can:view,booking'
        Route::get('/booking/{booking:booking_code}', [BookingController::class, 'payment'])
            ->name('booking.payment')
            ->can('view', 'booking'); // Laravel otomatis cek BookingPolicy::view
    });

    // --- AREA ADMIN ---
    Route::prefix('admin')->name('admin.')->middleware(['role:admin|super-admin'])->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('admin/dashboard/index');
        })->name('dashboard');

        // Resource Controller untuk Schedule
        Route::resource('schedules', ScheduleController::class);

        // MASTER DATA ROUTES
        Route::resource('branches', \App\Http\Controllers\Admin\BranchController::class);
        Route::resource('ships', \App\Http\Controllers\Admin\ShipController::class);

        // Perhatikan parameter binding di controller TripRouteController tadi
        // Laravel defaultnya resource param jadi trip_route (snake case dari nama model)
        Route::resource('trip-routes', \App\Http\Controllers\Admin\TripRouteController::class)
            ->parameters(['trip-routes' => 'tripRoute']);

        Route::resource('pricelists', \App\Http\Controllers\Admin\PricelistController::class);
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
