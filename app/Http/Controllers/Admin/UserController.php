<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class UserController extends Controller
{
    public function __construct()
    {
        // Enforce Super Admin only
        // We can uses middleware or authorize inside methods
    }

    private function ensureSuperAdmin()
    {
        if (! auth()->user()->hasRole('super-admin')) {
            abort(403, 'Unauthorized action.');
        }
    }

    public function index()
    {
        $this->authorize('users.view-any');

        $users = QueryBuilder::for(User::class)
            ->with(['roles', 'branch'])
            ->allowedFilters([
                'name',
                'email',
                AllowedFilter::exact('branch_id'),
            ])
            ->allowedSorts(['name', 'created_at'])
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/users/index/page', [
            'users' => $users,
            'roles' => Role::all(),
            'branches' => Branch::where('status', 'ACTIVE')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('users.create');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|exists:roles,name',
            'branch_id' => [
                'nullable',
                Rule::requiredIf(fn () => $request->role === 'operator'),
                'exists:branches,id',
            ],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'branch_id' => $validated['branch_id'],
            'role' => strtoupper($validated['role']), // Legacy column sync
        ]);

        $user->assignRole($validated['role']);

        return redirect()->back()->with('success', 'User created successfully.');
    }

    public function update(Request $request, User $user)
    {
        $this->authorize('users.update');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8',
            'role' => 'required|exists:roles,name',
            'branch_id' => [
                'nullable',
                Rule::requiredIf(fn () => $request->role === 'operator'),
                'exists:branches,id',
            ],
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'branch_id' => $validated['branch_id'],
            'role' => strtoupper($validated['role']), // Legacy column sync
        ];

        if (! empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        $user->update($data);
        $user->syncRoles([$validated['role']]);

        return redirect()->back()->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $this->authorize('users.delete');

        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Cannot delete yourself.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully.');
    }
}
