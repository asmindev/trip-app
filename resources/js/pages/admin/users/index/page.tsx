import { Can, usePermission } from '@/components/permissions';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/layouts/admin-layout';
import { Branch } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Shield, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { UserFormDialog } from '../components/user-form-dialog';
import { UserTable } from '../components/user-table';
import { Role, User } from '../types';

interface UserIndexProps {
    users: {
        data: User[];
        links: any[];
        meta: any;
    };
    roles: Role[];
    branches: Branch[];
}

export default function UserIndex({ users, roles, branches }: UserIndexProps) {
    const { can } = usePermission();
    const { flash } = usePage<any>().props;
    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleSearch = (value: string) => {
        setSearch(value);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            router.get(route('admin.users.index'), { search }, { preserveState: true, preserveScroll: true });
        }
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(route('admin.users.destroy', deleteId), {
                onSuccess: () => {
                    toast.success('User deleted successfully');
                    setDeleteId(null);
                },
                onError: () => toast.error('Failed to delete user'),
            });
        }
    };

    return (
        <AdminLayout title="Users & Roles">
            <Head title="Users & Roles" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold tracking-tight">Access Control</h1>
                    <p className="text-muted-foreground">Manage system users, roles, and permissions to ensure secure access.</p>
                </div>

                {/* Tabs Navigation */}
                <Tabs defaultValue="users" className="w-full">
                    <TabsList className={`grid w-full max-w-[400px] ${can('roles.view-any') ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        <TabsTrigger value="users" className="gap-2" onClick={() => {}}>
                            <Users className="h-4 w-4" />
                            Users
                        </TabsTrigger>
                        <Can permission="roles.view-any">
                            <TabsTrigger value="roles" className="gap-2" onClick={() => router.visit(route('admin.roles.index'))}>
                                <Shield className="h-4 w-4" />
                                Roles & Permissions
                            </TabsTrigger>
                        </Can>
                    </TabsList>
                </Tabs>

                {/* User Table */}
                <UserTable
                    users={users.data}
                    search={search}
                    onSearchChange={handleSearch}
                    onSearchKeyDown={handleSearchKeyDown}
                    onCreateClick={() => setIsCreateOpen(true)}
                    onEditClick={setEditingUser}
                    onDeleteClick={setDeleteId}
                />

                {/* Pagination (Simple for now) */}
                {/* Add PaginationLinks if needed similar to other pages */}
            </div>

            {/* Create/Edit Dialog */}
            <UserFormDialog
                open={isCreateOpen || !!editingUser}
                onClose={() => {
                    setIsCreateOpen(false);
                    setEditingUser(null);
                }}
                user={editingUser}
                roles={roles}
                branches={branches}
            />

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={(val) => !val && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user account and remove their access to the system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                            Delete User
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
