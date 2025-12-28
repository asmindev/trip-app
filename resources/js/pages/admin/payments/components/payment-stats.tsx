import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, CreditCard, DollarSign, XCircle } from 'lucide-react';

interface StatsData {
    total_payments: number;
    pending: number;
    paid: number;
    failed: number;
    total_amount: string;
}

interface PaymentStatsProps {
    stats: StatsData;
}

export function PaymentStats({ stats }: PaymentStatsProps) {
    const formatCurrency = (amount: string | number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                    <CreditCard className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total_payments.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">All transactions</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <Clock className="size-4 text-orange-500 dark:text-orange-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.pending.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Awaiting payment</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Paid</CardTitle>
                    <CheckCircle className="size-4 text-green-500 dark:text-green-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.paid.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Failed</CardTitle>
                    <XCircle className="size-4 text-red-500 dark:text-red-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.failed.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Failed/Expired</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="size-4 text-emerald-500 dark:text-emerald-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.total_amount)}</div>
                    <p className="text-xs text-muted-foreground">Paid amount</p>
                </CardContent>
            </Card>
        </div>
    );
}
