import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';
import { RecentBookingsTable } from './components/recent-bookings';
import { RevenueChart } from './components/revenue-chart';
import { RoutePerformanceChart } from './components/route-chart';
import { StatsGrid } from './components/stats-grid';
import { DashboardProps } from './types';

export default function AdminDashboard({ stats, revenueData, routePerformance, recentBookings }: DashboardProps) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            <div className="flex flex-col gap-8 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
                        <p className="text-muted-foreground">Ringkasan performa operasional kapal dan penjualan tiket.</p>
                    </div>
                    <div className="hidden items-center space-x-2 md:flex">
                        <Button>Download Laporan</Button>
                    </div>
                </div>

                {/* KPI Stats Grid */}
                <StatsGrid stats={stats} />

                {/* Main Charts Area */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <RevenueChart data={revenueData} />
                    <RoutePerformanceChart data={routePerformance} />
                </div>

                {/* Recent Transactions */}
                <RecentBookingsTable bookings={recentBookings} />
            </div>
        </AdminLayout>
    );
}
