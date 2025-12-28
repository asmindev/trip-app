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

use App\Models\Branch; // Import Branch

class PricelistController extends Controller
{
    private function getActiveBranchId()
    {
        return session('active_branch_id') ?? Branch::where('status', 'ACTIVE')->value('id');
    }

    public function index()
    {
        $activeBranchId = $this->getActiveBranchId();

        $pricelists = QueryBuilder::for(Pricelist::class)
            ->whereHas('tripRoute', function ($query) use ($activeBranchId) {
                $query->where('branch_id', $activeBranchId);
            })
            ->with(['tripRoute', 'tripType'])
            ->allowedFilters([
                AllowedFilter::exact('trip_route_id'),
                AllowedFilter::exact('is_active'),
            ])
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/pricelists/index/page', [
            'pricelists' => $pricelists,
            'routes' => TripRoute::where('branch_id', $activeBranchId)->select(['id', 'name'])->get(),
            'trip_types' => TripType::all(),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Pricelist::class);
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
        $this->authorize('update', $pricelist);
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

    public function destroy(Pricelist $pricelist)
    {
        $this->authorize('delete', $pricelist);
        // check the relation
        if ($pricelist->bookings()->exists()) {
            return redirect()->back()->with('error', 'Harga tidak dapat dihapus karena memiliki relasi dengan pemesanan.');
        }
        $pricelist->delete();

        return redirect()->back()->with('success', 'Harga berhasil dihapus.');
    }
}
