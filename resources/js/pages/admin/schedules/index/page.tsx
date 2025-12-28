import { Can } from '@/components/permissions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import { TripRoute } from '@/pages/admin/routes/types';
import { Ship } from '@/pages/admin/ships/components/schema';
import { Branch, PaginatedData } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Calendar as CalendarIcon, Filter, Plus, Search, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { BulkScheduleWizard } from '../components/bulk-schedule-wizard';
import { ScheduleFormDialog } from '../components/schedule-form-dialog';
import { ScheduleStats } from '../components/schedule-stats';
import { ScheduleTable } from '../components/schedule-table';
import { Schedule, TripType } from '../types';

interface StatsData {
    total: number;
    upcoming: number;
    today: number;
    issues: number;
}

interface ScheduleIndexProps {
    schedules: PaginatedData<Schedule>;
    ships: Ship[];
    routes: TripRoute[];
    tripTypes: TripType[];
    branches: Branch[];
    stats: StatsData;
}

export default function ScheduleIndex({ schedules, ships, routes, tripTypes, branches, stats }: ScheduleIndexProps) {
    const [search, setSearch] = useState('');
    const [branchFilter, setBranchFilter] = useState<string>('all');

    // Dialog states
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isBulkOpen, setIsBulkOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            route('admin.schedules.index'),
            { ...route().params, [key]: value === 'all' ? null : value },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDelete = (schedule: Schedule) => {
        if (confirm('Are you sure you want to delete this schedule?')) {
            router.delete(route('admin.schedules.destroy', schedule.id), {
                onSuccess: () => toast.success('Schedule deleted successfully'),
                onError: () => toast.error('Failed to delete schedule'),
            });
        }
    };

    return (
        <AdminLayout title="Schedule Management">
            <Head title="Schedules" />

            <div className="space-y-6 p-1">
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Schedules</h1>
                        <p className="mt-1 text-muted-foreground">Manage ship departures, monitor seat availability, and track fleet movements.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Can permission="schedules.create">
                            <Button variant="secondary" onClick={() => setIsBulkOpen(true)} className="shadow-sm">
                                <Sparkles className="mr-2 h-4 w-4 text-orange-500" />
                                Bulk Generate
                            </Button>
                            <Button onClick={() => setIsCreateOpen(true)} className="shadow-sm">
                                <Plus className="mr-2 h-4 w-4" />
                                New Schedule
                            </Button>
                        </Can>
                    </div>
                </div>

                {/* Statistics Cards */}
                <ScheduleStats stats={stats} />

                {/* Main Content Card */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="p-4 sm:p-6">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div className="flex flex-col gap-1">
                                <CardTitle className="text-lg">Departure Board</CardTitle>
                                <CardDescription>List of all scheduled and completed trips.</CardDescription>
                            </div>

                            {/* Toolbar */}
                            <div className="flex flex-wrap items-center gap-2">
                                {/* Search (Placeholder for future implementation) */}
                                <div className="relative">
                                    <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search routes..."
                                        className="h-9 w-[200px] pl-9 lg:w-[300px]"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        disabled
                                    />
                                </div>

                                {/* Filters */}
                                <Select
                                    value={branchFilter}
                                    onValueChange={(val) => {
                                        setBranchFilter(val);
                                        handleFilterChange('by_branch', val);
                                    }}
                                >
                                    <SelectTrigger className="h-9 w-[160px]">
                                        <div className="flex items-center gap-2">
                                            <Filter className="h-3.5 w-3.5 text-muted-foreground/70" />
                                            <SelectValue placeholder="Branch" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Branches</SelectItem>
                                        {branches.map((b) => (
                                            <SelectItem key={b.id} value={String(b.id)}>
                                                {b.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select onValueChange={(val) => handleFilterChange('status', val)}>
                                    <SelectTrigger className="h-9 w-[130px]">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
                                            <SelectValue placeholder="Status" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                                        <SelectItem value="DEPARTED">Departed</SelectItem>
                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="p-0">
                        <ScheduleTable
                            schedules={schedules.data}
                            onEdit={(s) => {
                                setEditingSchedule(s);
                                setIsCreateOpen(true);
                            }}
                            onDelete={handleDelete}
                        />
                    </CardContent>
                    <div className="border-t p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing {schedules.from || 0} to {schedules.to || 0} of {schedules.total} results
                            </p>
                            <div className="flex gap-2">
                                {schedules.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        className={!link.active ? 'text-muted-foreground' : ''}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <ScheduleFormDialog
                open={isCreateOpen}
                onOpenChange={(open) => {
                    setIsCreateOpen(open);
                    if (!open) setEditingSchedule(null);
                }}
                schedule={editingSchedule}
                ships={ships}
                routes={routes}
                tripTypes={tripTypes}
            />

            <BulkScheduleWizard open={isBulkOpen} onOpenChange={setIsBulkOpen} ships={ships} routes={routes} tripTypes={tripTypes} />
        </AdminLayout>
    );
}
