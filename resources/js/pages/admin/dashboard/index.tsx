import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';

export default function AdminDashboard() {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">128</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">Rp 15.000.000</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Active Ships</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">4</p>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
