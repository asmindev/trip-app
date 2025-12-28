<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
    public function index()
    {
        // Fitur Filter Canggih Spatie
        $schedules = QueryBuilder::for(Schedule::class)
            ->with(['ship', 'route', 'tripType']) // Eager Load relations
            ->allowedFilters([
                'status',
                AllowedFilter::exact('ship_id'),
                AllowedFilter::exact('trip_route_id'),
                AllowedFilter::scope('available'), // Scope dari Model
            ])
            ->defaultSort('-departure_date')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/schedules/index/page', [
            'schedules' => $schedules,
            'ships' => Ship::select(['id', 'name'])->get(),
            'routes' => TripRoute::select(['id', 'name'])->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'trip_route_id' => 'required|exists:trip_routes,id',
            'trip_type_id' => 'required|exists:trip_types,id',
            'ship_id' => 'required|exists:ships,id',
            'departure_date' => 'required|date|after:today',
            'departure_time' => 'required',
            'available_seats' => 'required|integer|min:1',
        ]);

        Schedule::create($validated);

        return redirect()->back()->with('success', 'Jadwal berhasil dibuat');
    }

    // ... method edit/update/destroy standar
    public function edit(Schedule $schedule)
    {
        return Inertia::render('admin/schedules/edit/page', [
            'schedule' => $schedule->load(['ship', 'route', 'tripType']),
            'ships' => Ship::select(['id', 'name'])->get(),
            'routes' => TripRoute::select(['id', 'name'])->get(),
            'tripTypes' => TripType::select(['id', 'name'])->get(),
        ]);
    }

    public function update(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'trip_route_id' => 'required|exists:trip_routes,id',
            'trip_type_id' => 'required|exists:trip_types,id',
            'ship_id' => 'required|exists:ships,id',
            'departure_date' => 'required|date|after:today',
            'departure_time' => 'required',
            'available_seats' => 'required|integer|min:1',
            'status' => 'required|in:SCHEDULED,DEPARTED,CANCELLED,COMPLETED',
        ]);

        $schedule->update($validated);

        return redirect()->route('admin.schedules.index')->with('success', 'Jadwal berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Schedule $schedule)
    {
        $schedule->delete();

        return redirect()->back()->with('success', 'Jadwal berhasil dihapus');
    }
}
