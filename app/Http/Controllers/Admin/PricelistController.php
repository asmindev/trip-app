<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pricelist;
use App\Models\TripRoute;
use App\Models\TripType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class PricelistController extends Controller
{
    public function index()
    {
        $pricelists = QueryBuilder::for(Pricelist::class)
            ->with(['tripRoute', 'tripType'])
            ->allowedFilters([
                AllowedFilter::exact('trip_route_id'),
                AllowedFilter::exact('is_active'),
            ])
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/pricelists/index/page', [
            'pricelists' => $pricelists,
            'routes' => TripRoute::select(['id', 'name'])->get(),
            'trip_types' => TripType::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'trip_route_id' => 'required|exists:trip_routes,id',
            'trip_type_id' => 'required|exists:trip_types,id',
            'price_public' => 'required|numeric|min:0',
            'price_event' => 'required|numeric|min:0',
            'effective_from' => 'required|date',
            'effective_until' => 'nullable|date|after_or_equal:effective_from',
        ]);

        // Opsional: Cek agar tidak ada harga duplikat untuk rute/tipe yang sama di tanggal yang sama
        Pricelist::create($validated + ['is_active' => true]);

        return redirect()->back()->with('success', 'Master harga berhasil disimpan.');
    }

    public function update(Request $request, Pricelist $pricelist)
    {
        $validated = $request->validate([
            'price_public' => 'required|numeric|min:0',
            'price_event' => 'required|numeric|min:0',
            'effective_from' => 'required|date',
            'effective_until' => 'nullable|date|after_or_equal:effective_from',
            'is_active' => 'boolean',
        ]);

        $pricelist->update($validated);

        return redirect()->back()->with('success', 'Harga berhasil diperbarui.');
    }
}
