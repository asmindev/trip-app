import { Can, usePermission } from '@/components/permissions';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/layouts/admin-layout';
import { Permission, Role } from '@/pages/admin/users/types';
import { Head, router } from '@inertiajs/react';
import { Shield, Users } from 'lucide-react';
import { RoleMatrix } from '../components/role-matrix';

interface RoleIndexProps {
    roles: Role[];
    grouped_permissions: Record<string, Permission[]>;
}

export default function RoleIndex({ roles, grouped_permissions }: RoleIndexProps) {
    const { can } = usePermission();

    return (
        <AdminLayout title="Users & Roles">
            <Head title="Roles & Permissions" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold tracking-tight">Access Control</h1>
                    <p className="text-muted-foreground">Manage system users, roles, and permissions to ensure secure access.</p>
                </div>

                {/* Tabs Navigation */}
                <Tabs defaultValue="roles" className="w-full">
                    <TabsList className={`grid w-full max-w-[400px] ${can('users.view-any') ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        <Can permission="users.view-any">
                            <TabsTrigger value="users" className="gap-2" onClick={() => router.visit(route('admin.users.index'))}>
                                <Users className="h-4 w-4" />
                                Users
                            </TabsTrigger>
                        </Can>
                        <Can permission="roles.view-any">
                            <TabsTrigger value="roles" className="gap-2" onClick={() => router.visit(route('admin.roles.index'))}>
                                <Shield className="h-4 w-4" />
                                Roles & Permissions
                            </TabsTrigger>
                        </Can>
                    </TabsList>
                </Tabs>

                {/* Role Matrix */}
                <RoleMatrix roles={roles} groupedPermissions={grouped_permissions} />
            </div>
        </AdminLayout>
    );
}
