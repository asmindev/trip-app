import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';

export default function AdminDashboard() {
    return (
        <div className="p-6">
            <Head title="Admin Dashboard" />
            <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>

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
        </div>
    );
}
