import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataPagination } from '@/components/ui/data-pagination';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDebouncedCallback } from '@/hooks/use-debounce';
import AdminLayout from '@/layouts/admin-layout';
import type { PaginatedData } from '@/types';
import { Head, router } from '@inertiajs/react';
import { PaymentStats } from '../components/payment-stats';
import { PaymentTable } from '../components/payment-table';

interface Payment {
    id: number;
    external_id: string;
    xendit_id: string | null;
    checkout_url: string | null;
    payment_method: string | null;
    status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
    amount: string;
    paid_at: string | null;
    created_at: string;
    booking: {
        id: number;
        booking_code: string;
        user: {
            name: string;
            email: string;
        };
        schedule: {
            departure_date: string;
            ship: {
                name: string;
            };
            route: {
                name: string;
            };
        };
    };
}

interface StatsData {
    total_payments: number;
    pending: number;
    paid: number;
    failed: number;
    total_amount: string;
    // NOTE: This stats calculation might need to be double checked with controller if it returns 'failed' key or others
}

interface PaymentIndexProps {
    payments: PaginatedData<Payment>;
    stats: StatsData;
    filters: Record<string, string | string[] | null>;
}

export default function PaymentIndex({ payments, stats, filters }: PaymentIndexProps) {
    const handleSearch = useDebouncedCallback((value: string) => {
        router.get(route('admin.payments.index'), { filter: { q: value } }, { preserveState: true, replace: true });
    }, 300);

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
            perPage={payments.per_page}
            onPerPageChange={handlePerPageChange}
        />
    );

    return (
        <AdminLayout breadcrumbs={[{ title: 'Payments', url: route('admin.payments.index') }]}>
            <Head title="Payments" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                        <p className="text-muted-foreground">Monitor Xendit payment transactions and status</p>
                    </div>
                </div>

                <PaymentStats stats={stats} />

                <Tabs defaultValue="all" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="all">All Payments</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="paid">Paid</TabsTrigger>
                        <TabsTrigger value="failed">Failed/Expired</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <CardTitle>All Payments</CardTitle>
                                        <CardDescription>Complete list of payment transactions</CardDescription>
                                    </div>
                                    {renderToolbar()}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <PaymentTable payments={payments.data} />
                                <DataPagination data={payments} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="pending" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <CardTitle>Pending Payments</CardTitle>
                                        <CardDescription>Awaiting customer payment</CardDescription>
                                    </div>
                                    {renderToolbar()}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <PaymentTable payments={payments.data.filter((p) => p.status === 'PENDING')} />
                                <DataPagination data={payments} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="paid" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <CardTitle>Paid Payments</CardTitle>
                                        <CardDescription>Successfully completed payments</CardDescription>
                                    </div>
                                    {renderToolbar()}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <PaymentTable payments={payments.data.filter((p) => p.status === 'PAID')} />
                                <DataPagination data={payments} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="failed" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <CardTitle>Failed/Expired Payments</CardTitle>
                                        <CardDescription>Payments that failed or expired</CardDescription>
                                    </div>
                                    {renderToolbar()}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <PaymentTable payments={payments.data.filter((p) => p.status === 'FAILED' || p.status === 'EXPIRED')} />
                                <DataPagination data={payments} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}
