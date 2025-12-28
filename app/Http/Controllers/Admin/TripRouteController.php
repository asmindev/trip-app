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
    public function index()
    {
        $routes = QueryBuilder::for(TripRoute::class)
            ->with('branch')
            ->allowedFilters([
                'name',
                AllowedFilter::exact('branch_id'),
            ])
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/routes/index/page', [
            'routes' => $routes,
            'branches' => Branch::select(['id', 'name'])->where('status', 'ACTIVE')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'name' => 'required|string|max:255',
            'duration_minutes' => 'required|integer|min:1',

            // Validasi JSON Waypoints
            'waypoints' => 'nullable|array',
            'waypoints.*.name' => 'required|string', // Nama titik (e.g. Pulau Bokori)
            'waypoints.*.time' => 'required|string', // Estimasi jam (e.g. 09:00)
        ]);

        TripRoute::create($validated);

        return redirect()->back()->with('success', 'Rute perjalanan berhasil dibuat.');
    }

    public function update(Request $request, TripRoute $tripRoute) // Implicit binding changed to $tripRoute
    {
        // Parameter di route harus {trip_route}, sesuaikan variabel di sini
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'name' => 'required|string|max:255',
            'duration_minutes' => 'required|integer|min:1',
            'status' => 'required|in:ACTIVE,INACTIVE',
            'waypoints' => 'nullable|array',
            'waypoints.*.name' => 'required|string',
            'waypoints.*.time' => 'required|string',
        ]);

        $tripRoute->update($validated);

        return redirect()->back()->with('success', 'Rute berhasil diupdate.');
    }

    public function destroy(TripRoute $tripRoute)
    {
        $tripRoute->delete();
        return redirect()->back()->with('success', 'Rute dihapus.');
    }
}
