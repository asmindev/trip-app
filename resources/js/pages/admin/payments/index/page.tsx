import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/layouts/admin-layout';
import type { PaginatedData } from '@/types';
import { Head } from '@inertiajs/react';
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
}

interface PaymentIndexProps {
    payments: PaginatedData<Payment>;
    stats: StatsData;
}

export default function PaymentIndex({ payments, stats }: PaymentIndexProps) {
    return (
        <AdminLayout title="Payment Management">
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
                                <CardTitle>All Payments</CardTitle>
                                <CardDescription>Complete list of payment transactions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <PaymentTable payments={payments.data} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="pending" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pending Payments</CardTitle>
                                <CardDescription>Awaiting customer payment</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <PaymentTable payments={payments.data.filter((p) => p.status === 'PENDING')} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="paid" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Paid Payments</CardTitle>
                                <CardDescription>Successfully completed payments</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <PaymentTable payments={payments.data.filter((p) => p.status === 'PAID')} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="failed" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Failed/Expired Payments</CardTitle>
                                <CardDescription>Payments that failed or expired</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <PaymentTable payments={payments.data.filter((p) => p.status === 'FAILED' || p.status === 'EXPIRED')} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}
