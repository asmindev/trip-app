import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, ArrowDownRight, ArrowUpRight, CreditCard, DollarSign, Ship } from 'lucide-react';
import { DashboardStats } from '../types';

interface StatsGridProps {
    stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
    const calculateTrend = (current: number, last: number) => {
        if (last === 0) return 100;
        return ((current - last) / last) * 100;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Pendapatan"
                value={formatCurrency(stats.revenue.current)}
                trend={calculateTrend(stats.revenue.current, stats.revenue.last_month)}
                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                description="vs bulan lalu"
            />
            <StatCard
                title="Tiket Terjual"
                value={stats.bookings.current.toLocaleString()}
                trend={calculateTrend(stats.bookings.current, stats.bookings.last_month)}
                icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
                description="vs bulan lalu"
            />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tingkat Okupansi</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.occupancy.rate}%</div>
                    <p className="text-xs text-muted-foreground">Rata-rata keterisian kursi bulan ini</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Operasional Hari Ini</CardTitle>
                    <Ship className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{stats.todays_departures}</span>
                        <span className="text-sm font-medium text-muted-foreground">Jadwal Berangkat</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{stats.active_ships} Kapal Aktif Beroperasi</p>
                </CardContent>
            </Card>
        </div>
    );
}

function StatCard({
    title,
    value,
    trend,
    icon,
    description,
}: {
    title: string;
    value: string;
    trend: number;
    icon: React.ReactNode;
    description: string;
}) {
    const isUp = trend >= 0;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <span className={`flex items-center ${isUp ? 'text-emerald-500' : 'text-red-500'} mr-1`}>
                        {isUp ? <ArrowUpRight className="mr-0.5 h-3 w-3" /> : <ArrowDownRight className="mr-0.5 h-3 w-3" />}
                        {Math.abs(trend).toFixed(1)}%
                    </span>
                    {description}
                </div>
            </CardContent>
        </Card>
    );
}
