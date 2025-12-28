<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;

class BranchController extends Controller
{
    public function index()
    {
        $branches = QueryBuilder::for(Branch::class)
            ->allowedFilters(['name', 'code', 'status'])
            ->allowedSorts(['name', 'created_at'])
            ->defaultSort('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/branches/index/page', [
            'branches' => $branches
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:branches,code',
            'location_address' => 'nullable|string',
        ]);

        Branch::create($validated);

        return redirect()->back()->with('success', 'Cabang berhasil ditambahkan.');
    }

    public function update(Request $request, Branch $branch)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:branches,code,' . $branch->id,
            'location_address' => 'nullable|string',
            'status' => 'required|in:ACTIVE,INACTIVE',
        ]);

        $branch->update($validated);

        return redirect()->back()->with('success', 'Cabang berhasil diperbarui.');
    }

    public function destroy(Branch $branch)
    {
        // Cek dulu apakah cabang punya kapal/user aktif agar aman
        if ($branch->ships()->exists() || $branch->users()->exists()) {
            return back()->with('error', 'Tidak bisa hapus cabang yang memiliki data Kapal/User.');
        }

        $branch->delete(); // Soft delete

        return redirect()->back()->with('success', 'Cabang berhasil dihapus.');
    }
}
