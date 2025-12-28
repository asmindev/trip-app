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
    public function index()
    {
        $ships = QueryBuilder::for(Ship::class)
            ->with('branch') // Eager load
            ->allowedFilters([
                'name',
                'status',
                AllowedFilter::exact('branch_id'), // Filter kapal berdasarkan cabang
            ])
            ->defaultSort('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/ships/index/page', [
            'ships' => $ships,
            // Kirim list cabang untuk dropdown filter/create
            'branches' => Branch::select(['id', 'name'])->where('status', 'ACTIVE')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'description' => 'nullable|string',
        ]);

        Ship::create($validated);

        return redirect()->back()->with('success', 'Kapal berhasil ditambahkan.');
    }

    public function update(Request $request, Ship $ship)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'status' => 'required|in:ACTIVE,MAINTENANCE,INACTIVE',
            'description' => 'nullable|string',
        ]);

        $ship->update($validated);

        return redirect()->back()->with('success', 'Data kapal diperbarui.');
    }

    public function destroy(Ship $ship)
    {
        $ship->delete();
        return redirect()->back()->with('success', 'Kapal dinonaktifkan (Soft Delete).');
    }
}
