import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataPagination } from '@/components/ui/data-pagination';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDebouncedCallback } from '@/hooks/use-debounce';
import AdminLayout from '@/layouts/admin-layout';
import type { PaginatedData } from '@/types';
import { Head, router } from '@inertiajs/react';
import { BookingStats } from '../components/booking-stats';
import { BookingTable } from '../components/booking-table';

interface Booking {
    id: number;
    booking_code: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    schedule: {
        id: number;
        departure_date: string;
        departure_time: string;
        ship: {
            name: string;
        };
        route: {
            name: string;
            // trip_type might be here or not, the interface had it.
        };
        trip_type: {
            name: string;
        };
    };
    total_passengers: number;
    total_amount: string;
    payment_status: 'PENDING' | 'PAID' | 'EXPIRED' | 'REFUNDED' | 'FAILED';
    paid_at: string | null;
    created_at: string;
}

interface StatsData {
    total_bookings: number;
    pending_payment: number;
    paid: number;
    total_revenue: string;
}

interface BookingIndexProps {
    bookings: PaginatedData<Booking>;
    stats: StatsData;
    filters: Record<string, string | string[] | null>;
}

export default function BookingIndex({ bookings, stats, filters }: BookingIndexProps) {
    const handleSearch = useDebouncedCallback((value: string) => {
        router.get(route('admin.bookings.index'), { filter: { q: value } }, { preserveState: true, replace: true });
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
            perPage={bookings.per_page}
            onPerPageChange={handlePerPageChange}
        />
    );

    return (
        <AdminLayout title="Booking Management">
            <Head title="Bookings" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
                        <p className="text-muted-foreground">Manage all customer bookings and reservations</p>
                    </div>
                </div>

                <BookingStats stats={stats} />

                <Tabs defaultValue="all" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="all">All Bookings</TabsTrigger>
                        <TabsTrigger value="pending">Pending Payment</TabsTrigger>
                        <TabsTrigger value="paid">Paid</TabsTrigger>
                        <TabsTrigger value="expired">Expired</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <CardTitle>All Bookings</CardTitle>
                                        <CardDescription>A list of all booking transactions</CardDescription>
                                    </div>
                                    {renderToolbar()}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <BookingTable bookings={bookings.data} />
                                <DataPagination data={bookings} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="pending" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <CardTitle>Pending Payment</CardTitle>
                                        <CardDescription>Bookings waiting for payment</CardDescription>
                                    </div>
                                    {renderToolbar()}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <BookingTable bookings={bookings.data.filter((b) => b.payment_status === 'PENDING')} />
                                <DataPagination data={bookings} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="paid" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <CardTitle>Paid Bookings</CardTitle>
                                        <CardDescription>Successfully paid bookings</CardDescription>
                                    </div>
                                    {renderToolbar()}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <BookingTable bookings={bookings.data.filter((b) => b.payment_status === 'PAID')} />
                                <DataPagination data={bookings} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="expired" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <CardTitle>Expired Bookings</CardTitle>
                                        <CardDescription>Bookings that have expired</CardDescription>
                                    </div>
                                    {renderToolbar()}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <BookingTable bookings={bookings.data.filter((b) => b.payment_status === 'EXPIRED')} />
                                <DataPagination data={bookings} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}
