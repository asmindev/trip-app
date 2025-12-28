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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PaginationLinks } from '@/components/ui/pagination-links';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { Branch, PaginatedData } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Building2, Edit, Eye, MapPin, MoreHorizontal, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    branches: PaginatedData<Branch>;
}

export default function BranchIndex({ branches }: Props) {
    const [deletingBranch, setDeletingBranch] = useState<Branch | null>(null);
    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
    const [viewingBranch, setViewingBranch] = useState<Branch | null>(null);

    const { delete: destroy } = useForm({});

    // Create Form
    const createForm = useForm({
        name: '',
        code: '',
        location_address: '',
    });

    // Edit Form
    const editForm = useForm({
        name: '',
        code: '',
        location_address: '',
        status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    });

    const confirmDelete = () => {
        if (!deletingBranch) return;
        destroy(route('admin.branches.destroy', deletingBranch.id), {
            onSuccess: () => {
                setDeletingBranch(null);
                toast.success('Branch deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete branch');
            },
        });
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            router.get(route('admin.branches.index'), { search }, { preserveState: true });
        }
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('admin.branches.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
                toast.success('Branch created successfully');
            },
            onError: () => {
                toast.error('Failed to create branch');
            },
        });
    };

    const handleEdit = (branch: Branch) => {
        setEditingBranch(branch);
        editForm.setData({
            name: branch.name,
            code: branch.code,
            location_address: branch.location_address || '',
            status: branch.status,
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBranch) return;

        editForm.put(route('admin.branches.update', editingBranch.id), {
            onSuccess: () => {
                setEditingBranch(null);
                toast.success('Branch updated successfully');
            },
            onError: () => {
                toast.error('Failed to update branch');
            },
        });
    };

    return (
        <AdminLayout title="Branches">
            <Head title="Manage Branches" />

            <div className="flex flex-col gap-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Branches</h2>
                        <p className="text-muted-foreground">Manage your operational branch locations and offices.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search branches..."
                                className="w-full bg-background pl-9 md:w-[250px]"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>
                        <Can permission="branches.create">
                            <Button onClick={() => setIsCreateOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" /> Add Branch
                            </Button>
                        </Can>
                    </div>
                </div>

                {/* Content Section */}
                <Card className="">
                    <CardHeader className="pt-6 pr-6 pb-4 pl-6">
                        <CardTitle>Branch List</CardTitle>
                        <CardDescription>A total of {branches.total} branches registered in the system.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[100px] pl-6">Code</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="pr-6 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {branches.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-96 text-center">
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <Building2 className="mb-4 h-12 w-12 opacity-20" />
                                                <p className="text-lg font-medium">No branches found</p>
                                                <p className="text-sm">Try adjusting your search or add a new branch.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    branches.data.map((branch) => (
                                        <TableRow key={branch.id} className="">
                                            <TableCell className="pl-6 font-mono font-medium text-primary">{branch.code}</TableCell>
                                            <TableCell className="font-medium">{branch.name}</TableCell>
                                            <TableCell>
                                                <div className="flex max-w-[300px] items-center truncate text-muted-foreground">
                                                    <MapPin className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                                                    <span className="truncate">{branch.location_address || 'No address provided'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={` ${
                                                        branch.status === 'ACTIVE'
                                                            ? 'border-green-500 bg-green-50 text-green-600'
                                                            : 'border-gray-400 bg-gray-50 text-gray-500'
                                                    } `}
                                                >
                                                    <span
                                                        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${branch.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400'}`}
                                                    ></span>
                                                    {branch.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 transition-opacity "
                                                        >
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <Can permission="branches.view">
                                                            <DropdownMenuItem onClick={() => setViewingBranch(branch)} className="cursor-pointer">
                                                                <Eye className="mr-2 h-4 w-4" /> View Details
                                                            </DropdownMenuItem>
                                                        </Can>
                                                        <Can permission="branches.update">
                                                            <DropdownMenuItem onClick={() => handleEdit(branch)} className="cursor-pointer">
                                                                <Edit className="mr-2 h-4 w-4" /> Edit Branch
                                                            </DropdownMenuItem>
                                                        </Can>
                                                        <DropdownMenuSeparator />
                                                        <Can permission="branches.delete">
                                                            <DropdownMenuItem
                                                                className="cursor-pointer text-destructive focus:text-destructive"
                                                                onClick={() => setDeletingBranch(branch)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
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

                <PaginationLinks links={branches.links} meta={branches} />
            </div>

            {/* Create Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New Branch</DialogTitle>
                        <DialogDescription>Create a new branch location for the system.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-name">Branch Name</Label>
                            <Input
                                id="create-name"
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                placeholder="e.g. Kendari Port"
                                required
                            />
                            {createForm.errors.name && <p className="text-sm text-destructive">{createForm.errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-code">Branch Code</Label>
                            <Input
                                id="create-code"
                                value={createForm.data.code}
                                onChange={(e) => createForm.setData('code', e.target.value)}
                                placeholder="e.g. KDI"
                                maxLength={10}
                                required
                            />
                            {createForm.errors.code && <p className="text-sm text-destructive">{createForm.errors.code}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-location">Location Address</Label>
                            <Textarea
                                id="create-location"
                                value={createForm.data.location_address}
                                onChange={(e) => createForm.setData('location_address', e.target.value)}
                                placeholder="Full address..."
                            />
                            {createForm.errors.location_address && <p className="text-sm text-destructive">{createForm.errors.location_address}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                Create Branch
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={!!editingBranch} onOpenChange={(open) => !open && setEditingBranch(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Branch</DialogTitle>
                        <DialogDescription>Update branch details.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Branch Name</Label>
                            <Input id="edit-name" value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} required />
                            {editForm.errors.name && <p className="text-sm text-destructive">{editForm.errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-code">Branch Code</Label>
                            <Input id="edit-code" value={editForm.data.code} onChange={(e) => editForm.setData('code', e.target.value)} required />
                            {editForm.errors.code && <p className="text-sm text-destructive">{editForm.errors.code}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-location">Location Address</Label>
                            <Textarea
                                id="edit-location"
                                value={editForm.data.location_address}
                                onChange={(e) => editForm.setData('location_address', e.target.value)}
                            />
                            {editForm.errors.location_address && <p className="text-sm text-destructive">{editForm.errors.location_address}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select value={editForm.data.status} onValueChange={(value: 'ACTIVE' | 'INACTIVE') => editForm.setData('status', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            {editForm.errors.status && <p className="text-sm text-destructive">{editForm.errors.status}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingBranch(null)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View Details Dialog */}
            <Dialog open={!!viewingBranch} onOpenChange={(open) => !open && setViewingBranch(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Branch Details</DialogTitle>
                        <DialogDescription>Detailed information about {viewingBranch?.name}.</DialogDescription>
                    </DialogHeader>
                    {viewingBranch && (
                        <div className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Branch Name</h4>
                                    <p className="font-medium text-foreground">{viewingBranch.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Branch Code</h4>
                                    <p className="font-mono font-medium text-foreground">{viewingBranch.code}</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                                <Badge variant={viewingBranch.status === 'ACTIVE' ? 'default' : 'secondary'}>{viewingBranch.status}</Badge>
                            </div>

                            <div className="space-y-1">
                                <h4 className="text-sm font-medium text-muted-foreground">Location Address</h4>
                                <div className="rounded-md border bg-muted/20 p-3">
                                    <p className="text-sm leading-relaxed text-foreground">{viewingBranch.location_address || 'No address provided'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                <div>
                                    <h4 className="text-xs font-medium text-muted-foreground">Created At</h4>
                                    <p className="text-xs text-muted-foreground">
                                        {viewingBranch.created_at ? new Date(viewingBranch.created_at).toLocaleString() : '-'}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-medium text-muted-foreground">Last Updated</h4>
                                    <p className="text-xs text-muted-foreground">
                                        {viewingBranch.updated_at ? new Date(viewingBranch.updated_at).toLocaleString() : '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setViewingBranch(null)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Alert */}
            <AlertDialog open={!!deletingBranch} onOpenChange={(open: boolean) => !open && setDeletingBranch(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the branch
                            <strong> {deletingBranch?.name}</strong> and remove it from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="text-destructive-foreground bg-destructive hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
