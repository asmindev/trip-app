import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';

export default function OperatorDashboard() {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Operator Dashboard" />

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Today's Departures</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">2</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tickets Scanned</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">45</p>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
