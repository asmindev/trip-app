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
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PaginationLinks } from '@/components/ui/pagination-links';
import AdminLayout from '@/layouts/admin-layout';
import { PageProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Clock, MapPin } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { RouteFormDialog } from '../components/route-form-dialog';
import { RouteStats } from '../components/route-stats';
import { RouteTable } from '../components/route-table';
import { RouteStatsData, TripRoute } from '../types';

// Pagination Types
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

type Props = {
    routes: {
        data: TripRoute[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    stats: RouteStatsData;
};

export default function TripRouteIndex({ routes, stats }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingRoute, setEditingRoute] = useState<TripRoute | null>(null);
    const [viewingRoute, setViewingRoute] = useState<TripRoute | null>(null);

    const { activeBranch } = usePage<PageProps & { activeBranch?: { id: number; name: string } }>().props;

    const formatDuration = (mins: number) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(route('admin.trip-routes.destroy', deleteId), {
                onSuccess: () => {
                    setDeleteId(null);
                    toast.success('Route deleted successfully');
                },
                onError: () => toast.error('Failed to delete route'),
            });
        }
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            router.get(route('admin.trip-routes.index'), { search }, { preserveState: true });
        }
    };

    return (
        <AdminLayout title="Route Management">
            <Head title="Route Management" />

            <div className="flex flex-col gap-8">
                {/* Stats Section */}
                <RouteStats activeBranchName={activeBranch?.name || 'Unknown'} stats={stats} />

                {/* Main Content */}
                <RouteTable
                    routes={routes.data}
                    search={search}
                    onSearchChange={setSearch}
                    onSearchKeyDown={handleSearch}
                    onCreateClick={() => setIsCreateOpen(true)}
                    onViewClick={setViewingRoute}
                    onEditClick={setEditingRoute}
                    onDeleteClick={setDeleteId}
                />

                <PaginationLinks links={routes.links} meta={routes.meta} />

                {/* View Details Dialog */}
                <Dialog open={!!viewingRoute} onOpenChange={(open) => !open && setViewingRoute(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{viewingRoute?.name}</DialogTitle>
                            <DialogDescription>Route details and waypoints</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span className="text-sm">
                                        Duration:{' '}
                                        <span className="font-medium text-foreground">{formatDuration(viewingRoute?.duration_minutes || 0)}</span>
                                    </span>
                                </div>
                                <Badge
                                    variant="outline"
                                    className={
                                        viewingRoute?.status === 'ACTIVE'
                                            ? 'border-green-200 bg-green-50 text-green-700'
                                            : 'border-gray-200 bg-gray-50 text-gray-600'
                                    }
                                >
                                    {viewingRoute?.status}
                                </Badge>
                            </div>

                            <div className="space-y-3">
                                <h4 className="flex items-center gap-2 text-sm font-medium">
                                    <MapPin className="h-4 w-4" />
                                    Waypoints ({viewingRoute?.waypoints?.length || 0})
                                </h4>
                                <div className="rounded-md border bg-muted/20 p-3">
                                    {!viewingRoute?.waypoints || viewingRoute.waypoints.length === 0 ? (
                                        <p className="py-2 text-center text-sm text-muted-foreground italic">Direct route (no stops)</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {viewingRoute.waypoints.map((wp, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                        {i + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="font-medium">{wp.name}</span>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">{wp.time}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Form Dialog (Create & Edit) */}
                <RouteFormDialog
                    open={isCreateOpen || !!editingRoute}
                    onClose={() => {
                        setIsCreateOpen(false);
                        setEditingRoute(null);
                    }}
                    mode={editingRoute ? 'edit' : 'create'}
                    initialData={editingRoute}
                    activeBranchName={activeBranch?.name || 'Unknown'}
                />

                {/* Delete Alert */}
                <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the route and all its history.
                            </AlertDialogDescription>
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
