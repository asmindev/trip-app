import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, CreditCard, DollarSign } from 'lucide-react';

interface StatsData {
    total_bookings: number;
    pending_payment: number;
    paid: number;
    total_revenue: string;
}

interface BookingStatsProps {
    stats: StatsData;
}

export function BookingStats({ stats }: BookingStatsProps) {
    const formatCurrency = (amount: string | number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                    <CreditCard className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total_bookings.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">All time bookings</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
                    <Clock className="size-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.pending_payment.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Awaiting payment</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Paid Bookings</CardTitle>
                    <CheckCircle className="size-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.paid.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Successfully paid</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="size-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.total_revenue)}</div>
                    <p className="text-xs text-muted-foreground">From paid bookings</p>
                </CardContent>
            </Card>
        </div>
    );
}
