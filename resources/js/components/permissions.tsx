import type { AuthData, Permission, Role } from '@/lib/permissions';
import { usePage } from '@inertiajs/react';

type CanProps = {
    permission: Permission | Permission[];
    fallback?: React.ReactNode;
    children: React.ReactNode;
};

/**
 * Component to conditionally render based on permissions
 *
 * @example
 * <Can permission="customers.create">
 *   <Button>Create Customer</Button>
 * </Can>
 *
 * @example
 * <Can permission={["customers.create", "customers.update"]} fallback={<p>No access</p>}>
 *   <Button>Manage Customer</Button>
 * </Can>
 */
export function Can({ permission, fallback = null, children }: CanProps) {
    const { auth } = usePage<{ auth: AuthData }>().props;

    if (!auth.user) return <>{fallback}</>;

    const permissions = Array.isArray(permission) ? permission : [permission];
    const hasPermission = permissions.some((perm) => auth.user!.permissions.includes(perm));

    return hasPermission ? <>{children}</> : <>{fallback}</>;
}

type HasRoleProps = {
    role: Role | Role[];
    fallback?: React.ReactNode;
    children: React.ReactNode;
};

/**
 * Component to conditionally render based on roles
 *
 * @example
 * <HasRole role="admin">
 *   <Button>Admin Only Action</Button>
 * </HasRole>
 *
 * @example
 * <HasRole role={["admin", "super-admin"]}>
 *   <SettingsPanel />
 * </HasRole>
 */
export function HasRole({ role, fallback = null, children }: HasRoleProps) {
    const { auth } = usePage<{ auth: AuthData }>().props;

    if (!auth.user) return <>{fallback}</>;

    const roles = Array.isArray(role) ? role : [role];
    const hasRole = roles.some((r) => auth.user!.roles.includes(r));

    return hasRole ? <>{children}</> : <>{fallback}</>;
}

/**
 * Hook to check permissions
 *
 * @example
 * const { can, hasRole, user } = usePermission();
 *
 * if (can('customers.create')) {
 *   // Show create button
 * }
 *
 * if (hasRole('admin')) {
 *   // Show admin features
 * }
 */
export function usePermission() {
    const { auth } = usePage<{ auth: AuthData }>().props;

    const can = (permission: Permission | Permission[]): boolean => {
        if (!auth.user) return false;

        const permissions = Array.isArray(permission) ? permission : [permission];
        return permissions.some((perm) => auth.user!.permissions.includes(perm));
    };

    const canAll = (permissions: Permission[]): boolean => {
        if (!auth.user) return false;

        return permissions.every((perm) => auth.user!.permissions.includes(perm));
    };

    const hasRole = (role: Role | Role[]): boolean => {
        if (!auth.user) return false;

        const roles = Array.isArray(role) ? role : [role];
        return roles.some((r) => auth.user!.roles.includes(r));
    };

    const hasAllRoles = (roles: Role[]): boolean => {
        if (!auth.user) return false;

        return roles.every((r) => auth.user!.roles.includes(r));
    };

    const isSuperAdmin = (): boolean => {
        return hasRole('super-admin');
    };

    const isAdmin = (): boolean => {
        return hasRole(['admin', 'super-admin']);
    };

    return {
        can,
        canAll,
        hasRole,
        hasAllRoles,
        isSuperAdmin,
        isAdmin,
        user: auth.user,
        permissions: auth.user?.permissions || [],
        roles: auth.user?.roles || [],
    };
}
