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
        $this->authorize('viewAny', Branch::class);

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
        $this->authorize('create', Branch::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:branches,code',
            'location_address' => 'nullable|string',
        ]);

        Branch::create($validated);

        return redirect()->back()->with('success', 'Branch created successfully.');
    }

    public function update(Request $request, Branch $branch)
    {
        $this->authorize('update', $branch);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:branches,code,' . $branch->id,
            'location_address' => 'nullable|string',
            'status' => 'required|in:ACTIVE,INACTIVE',
        ]);

        $branch->update($validated);

        return redirect()->back()->with('success', 'Branch updated successfully.');
    }

    public function destroy(Branch $branch)
    {
        $this->authorize('delete', $branch);

        $branch->delete();

        return redirect()->back()->with('success', 'Branch deleted successfully.');
    }

    public function switch(Request $request)
    {
        $request->validate([
            'branch_id' => 'required|exists:branches,id',
        ]);

        session(['active_branch_id' => $request->branch_id]);

        return redirect()->back()->with('success', 'Branch context switched.');
    }
}
