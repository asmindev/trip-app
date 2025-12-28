<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Ship;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ShipController extends Controller
{
    private function getActiveBranchId()
    {
        $id = session('active_branch_id');
        if (!$id) {
            // Fallback or handle error. ideally middleware handles this.
            // For now let's assume if no session, take the first one or null
            return Branch::where('status', 'ACTIVE')->value('id');
        }
        return $id;
    }

    public function index()
    {
        $activeBranchId = $this->getActiveBranchId();

        $ships = QueryBuilder::for(Ship::class)
            ->where('branch_id', $activeBranchId) // Enforce Active Branch Context
            ->allowedFilters([
                'name',
                'status',
            ])
            ->defaultSort('name')
            ->paginate(10)
            ->withQueryString();

        // Stats for "Surprise"
        $branchShips = Ship::where('branch_id', $activeBranchId);
        $totalCapacity = $branchShips->sum('capacity');
        $activeShipsCount = $branchShips->where('status', 'ACTIVE')->count();

        return Inertia::render('admin/ships/index/page', [
            'ships' => $ships,
            'stats' => [
                'total_capacity' => $totalCapacity,
                'active_ships' => $activeShipsCount,
                'total_ships' => $ships->total(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $activeBranchId = $this->getActiveBranchId();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'description' => 'nullable|string',
        ]);

        $validated['branch_id'] = $activeBranchId;

        Ship::create($validated);

        return redirect()->back()->with('success', 'Ship created successfully.');
    }

    public function update(Request $request, Ship $ship)
    {
        // Optional: Ensure we are only updating ships from active branch
        // if ($ship->branch_id != $this->getActiveBranchId()) abort(403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'status' => 'required|in:ACTIVE,MAINTENANCE,INACTIVE',
            'description' => 'nullable|string',
        ]);

        $ship->update($validated);

        return redirect()->back()->with('success', 'Ship updated successfully.');
    }

    public function destroy(Ship $ship)
    {
        $ship->delete();
        return redirect()->back()->with('success', 'Ship deleted successfully.');
    }
}
