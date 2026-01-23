<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Illuminate\Support\Facades\Auth;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request)
    {
        $user = Auth::user();
        if ($user->hasRole(['admin', 'super-admin']) || $user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        // 2. Redirect Operator
        if ($user->hasRole('operator') || $user->isOperator()) {
            return redirect()->route('operator.dashboard');
        }

        // 3. Redirect Customer (Default)
        return redirect()->intended(config('fortify.home'));
    }
}
