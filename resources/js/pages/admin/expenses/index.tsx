import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataPagination } from '@/components/ui/data-pagination';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDebouncedCallback } from '@/hooks/use-debounce';
import AdminLayout from '@/layouts/admin-layout';
import type { PaginatedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Filter, Plus } from 'lucide-react';
import { useState } from 'react';
import { ExpenseTable } from './components/expense-table';

interface Expense {
    id: number;
    amount: number;
    expense_date: string;
    description: string;
    approval_status: string;
    proof_file: string | null;
    branch: { id: number; name: string };
    category: { id: number; name: string };
    creator: { id: number; name: string };
}

interface Props {
    expenses: PaginatedData<Expense>;
    branches: { id: number; name: string }[];
    filters: Record<string, string | string[] | null>;
}

export default function ExpenseIndex({ expenses, branches, filters }: Props) {
    const [branchId, setBranchId] = useState<string>('all');

    // Debounce search to prevent too many requests
    const handleSearch = useDebouncedCallback((value: string) => {
        router.get(route('admin.expenses.index'), { filter: { q: value } }, { preserveState: true, replace: true });
    }, 300);

    const handleFilterBranch = (value: string) => {
        setBranchId(value);
        router.get(route('admin.expenses.index'), { 'filter[branch_id]': value === 'all' ? null : value }, { preserveState: true });
    };

    const handlePerPageChange = (value: string) => {
        const url = new URL(window.location.href);
        url.searchParams.set('per_page', value);
        url.searchParams.set('page', '1');
        router.get(url.toString(), {}, { preserveState: true, preserveScroll: true });
    };

    const renderToolbar = () => (
        <DataTableToolbar
            search={(filters?.q as string) || ''}
            onSearch={handleSearch}
            perPage={expenses.per_page}
            onPerPageChange={handlePerPageChange}
        >
            <div className="flex w-full gap-2 sm:w-auto">
                <Select onValueChange={handleFilterBranch} defaultValue={branchId}>
                    <SelectTrigger className="h-9 w-[180px]">
                        <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Semua Cabang" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Cabang</SelectItem>
                        {branches.map((b) => (
                            <SelectItem key={b.id} value={b.id.toString()}>
                                {b.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </DataTableToolbar>
    );

    return (
        <AdminLayout title="Pengeluaran">
            <Head title="Manajemen Pengeluaran" />

            <div className="space-y-6 p-4 md:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Pengeluaran</h1>
                        <p className="text-muted-foreground">Catat dan pantau pengeluaran operasional cabang.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.expenses.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Pengeluaran
                        </Link>
                    </Button>
                </div>

                <Tabs defaultValue="all" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="all">Semua</TabsTrigger>
                        <TabsTrigger value="approved">Approved</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <CardTitle>Semua Pengeluaran</CardTitle>
                                        <CardDescription>Daftar lengkap transaksi pengeluaran</CardDescription>
                                    </div>
                                    {renderToolbar()}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ExpenseTable expenses={expenses.data} />
                                <DataPagination data={expenses} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="approved" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <CardTitle>Pengeluaran Disetujui</CardTitle>
                                        <CardDescription>Transaksi yang telah diverifikasi</CardDescription>
                                    </div>
                                    {renderToolbar()}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ExpenseTable expenses={expenses.data.filter((e) => e.approval_status === 'APPROVED')} />
                                <DataPagination data={expenses} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="pending" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <CardTitle>Menunggu Persetujuan</CardTitle>
                                        <CardDescription>Transaksi yang membutuhkan validasi</CardDescription>
                                    </div>
                                    {renderToolbar()}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ExpenseTable expenses={expenses.data.filter((e) => e.approval_status === 'PENDING')} />
                                <DataPagination data={expenses} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="rejected" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <CardTitle>Pengeluaran Ditolak</CardTitle>
                                        <CardDescription>Transaksi yang tidak valid atau ditolak</CardDescription>
                                    </div>
                                    {renderToolbar()}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ExpenseTable expenses={expenses.data.filter((e) => e.approval_status === 'REJECTED')} />
                                <DataPagination data={expenses} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}
