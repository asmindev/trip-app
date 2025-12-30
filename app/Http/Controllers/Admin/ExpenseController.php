<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $expenses = QueryBuilder::for(Expense::class)
            ->with(['branch', 'category', 'creator'])
            ->allowedFilters([
                'description',
                AllowedFilter::callback('q', function ($query, $value) {
                    $query->where('description', 'like', "%{$value}%");
                }),
                AllowedFilter::exact('branch_id'),
                AllowedFilter::exact('expense_category_id'),
                AllowedFilter::exact('approval_status'),
                AllowedFilter::scope('date_between'), // we might need to add this scope to model or just use exact date
            ])
            ->allowedSorts(['expense_date', 'amount', 'created_at'])
            ->defaultSort('-expense_date')
            ->paginate(request('per_page', 10))
            ->withQueryString();

        return Inertia::render('admin/expenses/index', [
            'expenses' => $expenses,
            'branches' => Branch::all(['id', 'name']),
            'categories' => ExpenseCategory::where('is_active', true)->get(['id', 'name']),
            'filters' => request()->input('filter', []),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/expenses/create', [
            'branches' => Branch::all(['id', 'name']),
            'categories' => ExpenseCategory::where('is_active', true)->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'expense_category_id' => 'required|exists:expense_categories,id',
            'amount' => 'required|numeric|min:0',
            'expense_date' => 'required|date',
            'description' => 'required|string|max:1000',
            'proof_file' => 'nullable|image|max:2048', // 2MB Max
        ]);

        DB::transaction(function () use ($validated, $request) {
            $path = null;
            if ($request->hasFile('proof_file')) {
                $path = $request->file('proof_file')->store('expenses', 'public');
            }

            Expense::create([
                ...$validated,
                'proof_file' => $path,
                'created_by' => auth()->id(),
                'approval_status' => 'APPROVED', // Admin created expenses are auto-approved? Or PENDING? Let's say APPROVED for now if Admin, or PENDING if Operator. Assuming Admin context.
            ]);
        });

        return redirect()->route('admin.expenses.index')->with('success', 'Pengeluaran berhasil dicatat.');
    }

    public function show(Expense $expense)
    {
        //
    }

    public function edit(Expense $expense)
    {
        //
    }

    public function update(Request $request, Expense $expense)
    {
        //
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();
        return redirect()->back()->with('success', 'Data berhasil dihapus.');
    }
}
