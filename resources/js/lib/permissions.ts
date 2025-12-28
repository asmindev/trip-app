// Permission types for frontend usage
export type Permission =
    // Dashboard
    | 'dashboard.view-admin'
    | 'dashboard.view-operator'
    | 'dashboard.view-customer'
    | 'dashboard.analytics'

    // Master Data (Branches, Ships, Routes)
    | 'branches.view-any'
    | 'branches.view'
    | 'branches.create'
    | 'branches.update'
    | 'branches.delete'
    | 'ships.view-any'
    | 'ships.view'
    | 'ships.create'
    | 'ships.update'
    | 'ships.delete'
    | 'routes.view-any'
    | 'routes.view'
    | 'routes.create'
    | 'routes.update'
    | 'routes.delete'
    | 'routes.manage-waypoints'
    | 'trip-types.manage'

    // Master Data (Pricing & Promos)
    | 'pricelists.view-any'
    | 'pricelists.manage'
    | 'pricelists.create'
    | 'pricelists.update'
    | 'pricelists.delete'
    | 'promotions.view-any'
    | 'promotions.create'
    | 'promotions.update'
    | 'promotions.delete'

    // Operational (Schedules)
    | 'schedules.view-any'
    | 'schedules.view'
    | 'schedules.create'
    | 'schedules.update'
    | 'schedules.delete'
    | 'schedules.manage-seats' // Manual lock/unlock seat

    // Transaction (Bookings)
    | 'bookings.view-any' // Admin/Operator liat semua
    | 'bookings.view' // Detail booking
    | 'bookings.create' // Create booking (Customer/Admin)
    | 'bookings.update' // Edit info penumpang
    | 'bookings.cancel' // Cancel booking
    | 'bookings.refund' // Process refund
    | 'bookings.view-self' // Customer liat history sendiri

    // Payments (Xendit/Manual)
    | 'payments.view-any'
    | 'payments.view'
    | 'payments.approve' // Manual transfer approval
    | 'payments.void'

    // Scanning (Operator Features)
    | 'scan.view' // Akses halaman scan
    | 'scan.process' // Melakukan scanning
    | 'scan.history' // Liat history scan di branch dia

    // Expenses & Finance
    | 'expenses.view-any'
    | 'expenses.view'
    | 'expenses.create'
    | 'expenses.approve'
    | 'expenses.reject'
    | 'expense-categories.manage'

    // Reports
    | 'reports.view'
    | 'reports.export'
    | 'reports.sales'
    | 'reports.manifest' // Daftar penumpang per kapal
    | 'reports.financial'

    // Users & Access Control
    | 'users.view-any'
    | 'users.view'
    | 'users.create'
    | 'users.update'
    | 'users.delete'
    | 'users.assign-role'
    | 'users.assign-branch'

    // Roles & Permissions
    | 'roles.view-any'
    | 'roles.view'
    | 'roles.create'
    | 'roles.update'
    | 'roles.delete'
    | 'permissions.view'

    // Settings & Logs
    | 'settings.view'
    | 'settings.update'
    | 'audit-logs.view';

export type Role = 'super-admin' | 'admin' | 'operator' | 'customer';

export type AuthUser = {
    id: number;
    name: string;
    email: string;
    branch_id?: number | null; // Tambahan khusus app kita
    roles: Role[];
    permissions: Permission[];
};

export type AuthData = {
    user: AuthUser | null;
};

/**
 * Check if user has specific permission
 */
export function can(permissions: Permission | Permission[], userPermissions?: Permission[]): boolean {
    if (!userPermissions || userPermissions.length === 0) return false;

    const perms = Array.isArray(permissions) ? permissions : [permissions];

    return perms.some((permission) => userPermissions.includes(permission));
}

/**
 * Check if user has all specified permissions
 */
export function canAll(permissions: Permission[], userPermissions?: Permission[]): boolean {
    if (!userPermissions || userPermissions.length === 0) return false;

    return permissions.every((permission) => userPermissions.includes(permission));
}

/**
 * Check if user has specific role
 */
export function hasRole(roles: Role | Role[], userRoles?: Role[]): boolean {
    if (!userRoles || userRoles.length === 0) return false;

    const roleList = Array.isArray(roles) ? roles : [roles];

    return roleList.some((role) => userRoles.includes(role));
}

/**
 * Check if user has all specified roles
 */
export function hasAllRoles(roles: Role[], userRoles?: Role[]): boolean {
    if (!userRoles || userRoles.length === 0) return false;

    return roles.every((role) => userRoles.includes(role));
}
