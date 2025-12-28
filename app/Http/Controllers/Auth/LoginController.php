<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    public function create()
    {
        return Inertia::render('auth/login');
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'), $request->remember)) {
            $request->session()->regenerate();

            return redirect()->intended($this->redirectPath());
        }

        throw ValidationException::withMessages([
            'email' => __('auth.failed'),
        ]);
    }

    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    // Logic redirect berdasarkan Role
    protected function redirectPath()
    {
        $user = Auth::user();

        if ($user->hasRole('admin')) {
            return route('admin.dashboard');
        }

        if ($user->hasRole('operator')) {
            return route('operator.dashboard');
        }

        // Default Customer
        return route('home');
    }
}
