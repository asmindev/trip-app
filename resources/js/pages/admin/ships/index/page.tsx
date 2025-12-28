// resources/js/pages/admin/ships/index/page.tsx
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
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Ship } from '../components/schema';

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
    };
    branches: { id: number; name: string }[];
};

export default function ShipIndex({ ships, branches }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = () => {
        if (deleteId) {
            router.delete(route('admin.ships.destroy', deleteId));
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <Head title="Manajemen Kapal" />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Data Kapal</h1>
                    <p className="text-muted-foreground">Kelola armada kapal per cabang operasional.</p>
                </div>

                <Can permission="ships.create">
                    <Button asChild>
                        <Link href={route('admin.ships.create')}>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Kapal
                        </Link>
                    </Button>
                </Can>
            </div>

            {/* Table Content */}
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Kapal</TableHead>
                            <TableHead>Cabang</TableHead>
                            <TableHead>Kapasitas</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ships.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                                    Belum ada data kapal.
                                </TableCell>
                            </TableRow>
                        ) : (
                            ships.data.map((ship) => (
                                <TableRow key={ship.id}>
                                    <TableCell className="font-medium">{ship.name}</TableCell>
                                    <TableCell>{ship.branch?.name}</TableCell>
                                    <TableCell>{ship.capacity} Pax</TableCell>
                                    <TableCell>
                                        <Badge variant={ship.status === 'ACTIVE' ? 'default' : 'secondary'}>{ship.status}</Badge>
                                    </TableCell>
                                    <TableCell className="space-x-2 text-right">
                                        <Can permission="ships.update">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={route('admin.ships.edit', ship.id)}>
                                                    <Edit className="h-4 w-4 text-orange-500" />
                                                </Link>
                                            </Button>
                                        </Can>

                                        <Can permission="ships.delete">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(ship.id)}>
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Apakah Anda yakin ingin menghapus kapal "{ship.name}"? Tindakan ini tidak dapat
                                                            dibatalkan.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel onClick={() => setDeleteId(null)}>Batal</AlertDialogCancel>
                                                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                                            Hapus
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </Can>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination (Bisa dipisah jadi component terpisah nanti) */}
            <div className="flex justify-center gap-2">
                {ships.links.map((link: PaginationLink, i: number) =>
                    link.url ? (
                        <Link
                            key={i}
                            href={link.url}
                            className={`rounded border px-3 py-1 text-sm ${link.active ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <span key={i} className="rounded border px-3 py-1 text-sm text-gray-400" dangerouslySetInnerHTML={{ __html: link.label }} />
                    ),
                )}
            </div>
        </div>
    );
}
