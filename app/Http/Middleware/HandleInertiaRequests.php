<?php

namespace App\Http\Middleware;

use App\Models\Branch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $sharedBranches = [];
        $activeBranch = null;

        if ($user) {
            // Load all branches for the switcher
            $sharedBranches = Branch::select(['id', 'name', 'code'])->get();

            // Determine active branch: Session > First Available > Null
            if (session()->has('active_branch_id')) {
                $activeBranch = Branch::find(session('active_branch_id'));
            }

            if (!$activeBranch && $sharedBranches->isNotEmpty()) {
                $activeBranch = $sharedBranches->first();
            }
        }

        // Fetch settings with caching for high performance
        $appSettings = \Illuminate\Support\Facades\Cache::rememberForever('global_settings', function () {
            return \App\Models\Setting::all()->mapWithKeys(function ($setting) {
                return [$setting->key => $setting->formatted_value];
            })->toArray();
        });

        // Ensure app_name fallback for layout
        if (!isset($appSettings['app_name'])) {
            $appSettings['app_name'] = config('app.name', 'Kapal Trip');
        }

        return [
            ...parent::share($request),

            'app_settings' => $appSettings,
            'name' => $appSettings['app_name'] ?? config('app.name'),
            'sidebarOpen' => $request->cookie('sidebar_state', 'true') === 'true',
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->getRoleNames(),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                ] : null,
            ],

            // Global Data
            'sharedBranches' => $sharedBranches,
            'activeBranch' => $activeBranch,

            // 'ziggy' => fn() => [
            //     ...(new Ziggy)->toArray(),
            //     'location' => $request->url(),
            // ],

            'flash' => fn() => [
                'type' => session()->has('error')
                    ? 'error'
                    : (session()->has('success') ? 'success' : 'message'),
                'content' => session()->get('error')
                    ?? session()->get('success')
                    ?? session()->get('message'),
            ],
        ];
    }
}
