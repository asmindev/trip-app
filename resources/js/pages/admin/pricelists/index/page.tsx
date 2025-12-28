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
import { PaginationLinks } from '@/components/ui/pagination-links';
import AdminLayout from '@/layouts/admin-layout';
import { PageProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { PricelistFormDialog } from '../components/pricelist-form-dialog';
import { PricelistStats } from '../components/pricelist-stats';
import { PricelistTable } from '../components/pricelist-table';
import { Pricelist, TripRoute, TripType } from '../types';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
}

interface Props {
    pricelists: {
        data: Pricelist[];
        links?: PaginationLink[];
        meta?: PaginationMeta;
        // Laravel sometimes flattens these
        current_page?: number;
        last_page?: number;
        from?: number | null;
        to?: number | null;
        total?: number;
    };
    routes: TripRoute[];
    trip_types: TripType[];
}

export default function PricelistIndex({ pricelists, routes, trip_types }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingPricelist, setEditingPricelist] = useState<Pricelist | null>(null);

    const { activeBranch } = usePage<PageProps & { activeBranch?: { id: number; name: string } }>().props;

    // Handle both nested 'meta' and flat pagination formats
    const paginationMeta = pricelists.meta || {
        current_page: pricelists.current_page || 1,
        last_page: pricelists.last_page || 1,
        from: pricelists.from || null,
        to: pricelists.to || null,
        total: pricelists.total || 0,
        path: '',
        per_page: 20,
    };
    const paginationLinks = pricelists.links || [];

    const handleDelete = () => {
        if (deleteId) {
            router.delete(route('admin.pricelists.destroy', deleteId), {
                onSuccess: () => {
                    setDeleteId(null);
                    toast.success('Price deleted successfully');
                },
                onError: () => toast.error('Failed to delete price'),
            });
        }
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            router.get(route('admin.pricelists.index'), { search }, { preserveState: true });
        }
    };

    return (
        <AdminLayout title="Pricelist">
            <Head title="Pricelist" />

            <div className="flex flex-col gap-6">
                {/* Stats Section */}
                <PricelistStats pricelists={pricelists.data} activeBranchName={activeBranch?.name} />

                {/* Main Table */}
                <PricelistTable
                    pricelists={pricelists.data}
                    search={search}
                    onSearchChange={setSearch}
                    onSearchKeyDown={handleSearch}
                    onCreateClick={() => setIsCreateOpen(true)}
                    onEditClick={setEditingPricelist}
                    onDeleteClick={setDeleteId}
                />

                {/* Pagination */}
                {paginationMeta.last_page > 1 && <PaginationLinks links={paginationLinks} meta={paginationMeta} />}

                {/* Form Dialog */}
                <PricelistFormDialog
                    open={isCreateOpen || !!editingPricelist}
                    onClose={() => {
                        setIsCreateOpen(false);
                        setEditingPricelist(null);
                    }}
                    mode={editingPricelist ? 'edit' : 'create'}
                    initialData={editingPricelist}
                    routes={routes}
                    tripTypes={trip_types}
                />

                {/* Delete Confirmation */}
                <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Price</AlertDialogTitle>
                            <AlertDialogDescription>Are you sure you want to delete this price? This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
}
