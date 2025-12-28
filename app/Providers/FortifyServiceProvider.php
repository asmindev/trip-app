<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use App\Http\Responses\LoginResponse; // <--- Import Custom Response kita
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia; // <--- Import Inertia
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract; // <--- Import Contract
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 1. SETUP ACTION (Bawaan)
        Fortify::createUsersUsing(CreateNewUser::class);
        Fortify::updateUserProfileInformationUsing(UpdateUserProfileInformation::class);
        Fortify::updateUserPasswordsUsing(UpdateUserPassword::class);
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        // Fortify::redirectUserForTwoFactorAuthenticationUsing(RedirectIfTwoFactorAuthenticatable::class);

        // 2. SETUP VIEW (Hubungkan ke Inertia React)
        Fortify::loginView(function () {
            return Inertia::render('Auth/Login', [
                'status' => session('status'),
                'canResetPassword' => \Illuminate\Support\Facades\Route::has('password.request'),
            ]);
        });

        // Opsional: Jika nanti mau bikin halaman Register
        Fortify::registerView(function () {
            return Inertia::render('auth/register');
        });

        // 3. OVERRIDE REDIRECT LOGIC (PENTING!)
        // Ini memberitahu Laravel: "Kalau login sukses, pakai logic di file LoginResponse.php saya"
        $this->app->singleton(LoginResponseContract::class, LoginResponse::class);

        // 4. RATE LIMITERS (Bawaan)
        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())) . '|' . $request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });
    }
}
