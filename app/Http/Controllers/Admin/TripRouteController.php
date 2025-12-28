<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\TripRoute;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class TripRouteController extends Controller
{
    private function getActiveBranchId()
    {
        return session('active_branch_id') ?? Branch::where('status', 'ACTIVE')->value('id');
    }

    public function index()
    {
        $activeBranchId = $this->getActiveBranchId();

        $routes = QueryBuilder::for(TripRoute::class)
            ->where('branch_id', $activeBranchId) // Active Branch Context
            ->allowedFilters([
                'name',
            ])
            ->defaultSort('name')
            ->paginate(10)
            ->withQueryString();

        // Stats
        $routesQuery = TripRoute::where('branch_id', $activeBranchId);
        $stats = [
            'total_routes' => $routesQuery->count(),
            'total_waypoints' => $routesQuery->get()->sum(fn($r) => count($r->waypoints ?? [])),
            'avg_duration' => round($routesQuery->avg('duration_minutes') ?? 0),
        ];

        return Inertia::render('admin/routes/index/page', [
            'routes' => $routes,
            'stats' => $stats,
        ]);
    }

    public function store(Request $request)
    {
        $activeBranchId = $this->getActiveBranchId();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'duration_minutes' => 'required|integer|min:1',
            'waypoints' => 'nullable|array',
            'waypoints.*.name' => 'required|string',
            'waypoints.*.time' => 'required|string',
        ]);

        $validated['branch_id'] = $activeBranchId;

        TripRoute::create($validated);

        return redirect()->back()->with('success', 'Route created successfully.');
    }

    public function update(Request $request, TripRoute $tripRoute)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'duration_minutes' => 'required|integer|min:1',
            'status' => 'required|in:ACTIVE,INACTIVE',
            'waypoints' => 'nullable|array',
            'waypoints.*.name' => 'required|string',
            'waypoints.*.time' => 'required|string',
        ]);

        $tripRoute->update($validated);

        return redirect()->back()->with('success', 'Route updated successfully.');
    }

    public function destroy(TripRoute $tripRoute)
    {
        $tripRoute->delete();
        return redirect()->back()->with('success', 'Rute dihapus.');
    }
}
