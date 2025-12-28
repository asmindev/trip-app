<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        $this->authorize('roles.view-any');

        $roles = Role::with('permissions')->get();
        // Return structured permissions
        $permissions = Permission::all()->transform(function ($perm) {
            // Optional: Rename specific groups if needed, e.g. 'users' -> 'User Management'
            return $perm;
        })->groupBy(function ($perm) {
            return explode('.', $perm->name)[0];
        })->sortKeys();

        return Inertia::render('admin/roles/index/page', [
            'roles' => $roles,
            'grouped_permissions' => $permissions,
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $this->authorize('roles.update');

        $validated = $request->validate([
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        // Prevent modifying super-admin permissions (redundant as they have all, but safe)
        if ($role->name === 'super-admin') {
            return redirect()->back()->with('error', 'Super Admin permissions cannot be modified.');
        }

        $role->syncPermissions($validated['permissions'] ?? []);

        // Log activity manually if needed or rely on spatie/laravel-activitylog if configured models

        return redirect()->back()->with('success', "Permissions for {$role->name} updated.");
    }
}
