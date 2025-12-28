<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Schedule;
use App\Models\Ship;
use App\Models\TripRoute;
use App\Models\TripType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class ScheduleController extends Controller
{
    private function getActiveBranchId()
    {
        $id = session('active_branch_id');
        if (!$id) {
            return Branch::where('status', 'ACTIVE')->value('id');
        }
        return $id;
    }

    public function index()
    {
        $this->authorize('schedules.view-any');

        $activeBranchId = $this->getActiveBranchId();

        $schedules = QueryBuilder::for(Schedule::class)
            ->with(['ship', 'route', 'tripType'])
            ->whereHas('route', fn($q) => $q->where('branch_id', $activeBranchId)) // Scope by active branch
            ->allowedFilters([
                'status',
                AllowedFilter::exact('ship_id'),
                AllowedFilter::exact('trip_route_id'),
                AllowedFilter::exact('trip_type_id'),
                AllowedFilter::scope('available'),
                // AllowedFilter::scope('by_branch'), // Handled by default scope now
                AllowedFilter::callback('date_range', function ($query, $dateRange) {
                    $dates = explode(',', $dateRange);
                    if (count($dates) === 2) {
                        $query->whereBetween('departure_date', $dates);
                    }
                }),
            ])
            ->defaultSort('-departure_date')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/schedules/index/page', [
            'schedules' => $schedules,
            'ships' => Ship::where('branch_id', $activeBranchId)->select(['id', 'name', 'branch_id', 'capacity'])->get(),
            'routes' => TripRoute::where('branch_id', $activeBranchId)->select(['id', 'name', 'branch_id', 'duration_minutes'])->get(),
            'tripTypes' => TripType::all(),
            'branches' =>Branch::where('status', 'ACTIVE')->get(),
            'stats' => [
                'total' => Schedule::whereHas('route', fn($q) => $q->where('branch_id', $activeBranchId))->count(),
                'upcoming' => Schedule::whereHas('route', fn($q) => $q->where('branch_id', $activeBranchId))->where('departure_date', '>', now())->count(),
                'today' => Schedule::whereHas('route', fn($q) => $q->where('branch_id', $activeBranchId))->whereDate('departure_date', now())->count(),
                'issues' => Schedule::whereHas('route', fn($q) => $q->where('branch_id', $activeBranchId))->where('available_seats', 0)->where('status', 'SCHEDULED')->count(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('schedules.create');

        $validated = $request->validate([
            'trip_route_id' => 'required|exists:trip_routes,id',
            'trip_type_id' => 'required|exists:trip_types,id',
            'ship_id' => 'required|exists:ships,id',
            'departure_date' => 'required|date|after_or_equal:today',
            'departure_time' => 'required',
            'available_seats' => 'required|integer|min:0',
        ]);

        // Validate consistency: Ship and Route must be from same branch
        $ship = Ship::find($validated['ship_id']);
        $route = TripRoute::find($validated['trip_route_id']);

        if ($ship->branch_id !== $route->branch_id) {
            return redirect()->back()->withErrors(['ship_id' => 'Ship and Route must belong to the same branch.']);
        }

        Schedule::create($validated);

        return redirect()->back()->with('success', 'Jadwal berhasil dibuat');
    }

    public function bulkStore(Request $request, \App\Services\ScheduleGenerator $generator)
    {
        $this->authorize('schedules.create');

        $validated = $request->validate([
            'trip_route_id' => 'required|exists:trip_routes,id',
            'trip_type_id' => 'required|exists:trip_types,id',
            'ship_id' => 'required|exists:ships,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'days_of_week' => 'required|array|min:1',
            'days_of_week.*' => 'integer|between:0,6',
            'departure_time' => 'required',
        ]);

        // Validate consistency
        $ship = Ship::find($validated['ship_id']);
        $route = TripRoute::find($validated['trip_route_id']);

        if ($ship->branch_id !== $route->branch_id) {
            return redirect()->back()->withErrors(['ship_id' => 'Ship and Route must belong to the same branch.']);
        }

        $schedules = $generator->generate($validated);

        return redirect()->back()->with('success', "{$schedules->count()} jadwal berhasil digenerate.");
    }

    public function update(Request $request, Schedule $schedule)
    {
        $this->authorize('schedules.update');

        $validated = $request->validate([
            'trip_route_id' => 'required|exists:trip_routes,id',
            'trip_type_id' => 'required|exists:trip_types,id',
            'ship_id' => 'required|exists:ships,id',
            'departure_date' => 'required|date',
            'departure_time' => 'required',
            'available_seats' => 'required|integer|min:0',
            'status' => 'required|in:SCHEDULED,DEPARTED,CANCELLED,COMPLETED',
        ]);

        // Validate consistency
        $ship = Ship::find($validated['ship_id']);
        $route = TripRoute::find($validated['trip_route_id']);

        if ($ship->branch_id !== $route->branch_id) {
            return redirect()->back()->withErrors(['ship_id' => 'Ship and Route must belong to the same branch.']);
        }

        $schedule->update($validated);

        return redirect()->back()->with('success', 'Jadwal berhasil diperbarui');
    }

    public function destroy(Schedule $schedule)
    {
        $this->authorize('schedules.delete');
        $schedule->delete();

        return redirect()->back()->with('success', 'Jadwal berhasil dihapus');
    }
}
