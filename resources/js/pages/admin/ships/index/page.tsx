import { Can } from '@/components/permissions';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PaginationLinks } from '@/components/ui/pagination-links';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Anchor, Edit, MoreHorizontal, Plus, Search, Ship as ShipIcon, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Ship } from '../components/schema';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AdminLayout from '@/layouts/admin-layout';
import { PageProps } from '@/types';

// Interface untuk Pagination Link
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

// Interface untuk Pagination Meta
interface PaginationMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
}

// Types Props dari Controller
type Props = {
    ships: {
        data: Ship[];
        links: PaginationLink[];
        meta: PaginationMeta;
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
    };
    stats: {
        total_capacity: number;
        active_ships: number;
        total_ships: number;
    };
};

export default function ShipIndex({ ships, stats }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingShip, setEditingShip] = useState<Ship | null>(null);

    const { activeBranch } = usePage<PageProps & { activeBranch?: { id: number; name: string } }>().props;

    // Create Form
    const createForm = useForm({
        name: '',
        capacity: '' as string | number,
        description: '',
    });

    // Edit Form
    const editForm = useForm({
        name: '',
        capacity: '' as string | number,
        description: '',
        status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE',
    });

    const handleDelete = () => {
        if (deleteId) {
            router.delete(route('admin.ships.destroy', deleteId), {
                onSuccess: () => {
                    setDeleteId(null);
                    toast.success('Ship deleted successfully');
                },
                onError: () => toast.error('Failed to delete ship'),
            });
        }
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            router.get(route('admin.ships.index'), { search }, { preserveState: true });
        }
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('admin.ships.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
                toast.success('Ship created successfully');
            },
            onError: () => toast.error('Failed to create ship'),
        });
    };

    const handleEditClick = (ship: Ship) => {
        setEditingShip(ship);
        editForm.setData({
            name: ship.name,
            capacity: ship.capacity,
            description: ship.description || '',
            status: ship.status,
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingShip) return;

        editForm.put(route('admin.ships.update', editingShip.id), {
            onSuccess: () => {
                setEditingShip(null);
                toast.success('Ship updated successfully');
            },
            onError: () => toast.error('Failed to update ship'),
        });
    };

    return (
        <AdminLayout title="Fleet Management">
            <Head title="Fleet Management" />

            <div className="flex flex-col gap-8">
                {/* Header & Stats Section */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-primary text-primary-foreground shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Branch</CardTitle>
                            <Anchor className="h-4 w-4 opacity-70" />
                        </CardHeader>
                        <CardContent>
                            <div className="truncate text-2xl font-bold">{activeBranch?.name || 'Unknown'}</div>
                            <p className="text-xs opacity-70">Operational Dashboard</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Ships</CardTitle>
                            <ShipIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_ships}</div>
                            <p className="text-xs text-muted-foreground">Registered in this branch</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Fleet</CardTitle>
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_ships}</div>
                            <p className="text-xs text-muted-foreground">Ships currently active</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_capacity}</div>
                            <p className="text-xs text-muted-foreground">Passenger seats available</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Card */}
                <Card>
                    <CardHeader className="px-6 pt-6 pb-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle className="text-xl">Fleet Overview</CardTitle>
                                <CardDescription>Manage your ships, update statuses, and track capacity.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search ships..."
                                        className="w-full bg-background pl-9 md:w-[250px]"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={handleSearch}
                                    />
                                </div>
                                <Can permission="ships.create">
                                    <Button onClick={() => setIsCreateOpen(true)} className="bg-primary hover:bg-primary/90">
                                        <Plus className="mr-2 h-4 w-4" /> Add Ship
                                    </Button>
                                </Can>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="w-[30%] pl-6">Vessel Name</TableHead>
                                    <TableHead className="w-[20%]">Capacity</TableHead>
                                    <TableHead className="w-[15%]">Status</TableHead>
                                    <TableHead className="w-[25%]">Description</TableHead>
                                    <TableHead className="w-[10%] pr-6 text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ships.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <ShipIcon className="mb-4 h-16 w-16 opacity-10" />
                                                <h3 className="text-lg font-medium text-foreground">No ships found</h3>
                                                <p className="text-sm">Get started by adding a new vessel to your fleet.</p>
                                                <Button variant="outline" className="mt-4" onClick={() => setIsCreateOpen(true)}>
                                                    Add First Ship
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    ships.data.map((ship) => (
                                        <TableRow key={ship.id} className="group transition-colors hover:bg-muted/50">
                                            <TableCell className="pl-6 font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                                        <ShipIcon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-foreground">{ship.name}</div>
                                                        <div className="line-clamp-1 text-xs text-muted-foreground">{ship.branch?.name}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-mono">{ship.capacity}</span>
                                                    <span className="text-xs text-muted-foreground">pax</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        ship.status === 'ACTIVE'
                                                            ? 'border-green-200 bg-green-50 text-green-700'
                                                            : ship.status === 'MAINTENANCE'
                                                              ? 'border-orange-200 bg-orange-50 text-orange-700'
                                                              : 'border-gray-200 bg-gray-50 text-gray-600'
                                                    }
                                                >
                                                    {ship.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-[200px] truncate text-sm text-muted-foreground" title={ship.description || ''}>
                                                    {ship.description || '-'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <Can permission="ships.update">
                                                            <DropdownMenuItem onClick={() => handleEditClick(ship)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                        </Can>
                                                        <DropdownMenuSeparator />
                                                        <Can permission="ships.delete">
                                                            <DropdownMenuItem
                                                                onClick={() => setDeleteId(ship.id)}
                                                                className="text-destructive focus:text-destructive"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </Can>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <PaginationLinks links={ships.links} meta={ships} />

                {/* Create Dialog */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Ship</DialogTitle>
                            <DialogDescription>Register a new vessel to {activeBranch?.name}.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Ship Name</Label>
                                <Input
                                    id="name"
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    placeholder="e.g. Express Bahari 99"
                                    required
                                />
                                {createForm.errors.name && <p className="text-xs text-destructive">{createForm.errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="capacity">Capacity (Pax)</Label>
                                <Input
                                    id="capacity"
                                    type="number"
                                    value={createForm.data.capacity}
                                    onChange={(e) => createForm.setData('capacity', e.target.value)}
                                    placeholder="e.g. 200"
                                    min="1"
                                    required
                                />
                                {createForm.errors.capacity && <p className="text-xs text-destructive">{createForm.errors.capacity}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea
                                    id="description"
                                    value={createForm.data.description}
                                    onChange={(e) => createForm.setData('description', e.target.value)}
                                    placeholder="Additional details..."
                                    className="resize-none"
                                />
                                {createForm.errors.description && <p className="text-xs text-destructive">{createForm.errors.description}</p>}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={createForm.processing}>
                                    Create Ship
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={!!editingShip} onOpenChange={(open) => !open && setEditingShip(null)}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Ship</DialogTitle>
                            <DialogDescription>Update details for {editingShip?.name}.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdate} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Ship Name</Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    required
                                />
                                {editForm.errors.name && <p className="text-xs text-destructive">{editForm.errors.name}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-capacity">Capacity</Label>
                                    <Input
                                        id="edit-capacity"
                                        type="number"
                                        value={editForm.data.capacity}
                                        onChange={(e) => editForm.setData('capacity', e.target.value)}
                                        required
                                    />
                                    {editForm.errors.capacity && <p className="text-xs text-destructive">{editForm.errors.capacity}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-status">Status</Label>
                                    <Select
                                        value={editForm.data.status}
                                        onValueChange={(val: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE') => editForm.setData('status', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ACTIVE">Active</SelectItem>
                                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                                            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {editForm.errors.status && <p className="text-xs text-destructive">{editForm.errors.status}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                    id="edit-description"
                                    value={editForm.data.description}
                                    onChange={(e) => editForm.setData('description', e.target.value)}
                                    className="resize-none"
                                />
                                {editForm.errors.description && <p className="text-xs text-destructive">{editForm.errors.description}</p>}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditingShip(null)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={editForm.processing}>
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Alert */}
                <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the ship from the fleet history.
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
