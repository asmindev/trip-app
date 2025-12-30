import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Filter } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '../components/empty-state';
import { FilterSidebar } from '../components/filter-sidebar';
import { ScheduleCard } from '../components/schedule-card';
import { SearchWidget } from '../components/search-widget';
import type { Schedule, SearchFilters, TripType } from '../types';

interface PageProps {
    schedules: PaginatedData<Schedule>;
    filters?: Partial<SearchFilters>;
    trip_types: TripType[];
}

export default function BookingIndexPage({ schedules, filters = {} }: PageProps) {
    const { props } = usePage();
    const trip_types = props.trip_types as TripType[];
    const globalSettings = props.app_settings as { app_name?: string } | undefined;
    const appName = globalSettings?.app_name || 'Kapal Trip';
    const [activeFilters, setActiveFilters] = useState<SearchFilters>(filters);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleFilterChange = (newFilters: SearchFilters) => {
        setActiveFilters(newFilters);

        // Trigger a new search
        router.get(
            route('booking.index'),
            {
                filter: {
                    ...filters,
                    ...newFilters,
                },
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['schedules', 'filters'],
            },
        );
    };

    return (
        <AppLayout>
            <Head title={`Jadwal Trip - ${appName}`} />

            {/* Gradient Hero Search Header */}
            <div className="relative min-h-[40vh] overflow-hidden bg-linear-to-br from-orange-500 via-orange-600 to-orange-800 pt-24 pb-32 sm:min-h-fit dark:from-orange-600 dark:to-slate-900">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute top-10 -left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute -right-10 bottom-10 h-64 w-64 rounded-full bg-yellow-400/20 blur-3xl"></div>

                <div className="relative z-10 container mx-auto px-2 sm:px-4">
                    <h1 className="mb-6 text-center text-3xl font-bold text-white drop-shadow-md md:text-4xl">Jadwal Trip</h1>
                    <div className="mx-auto max-w-4xl rounded-2xl border border-white/20 bg-white/10 p-1.5 shadow-2xl backdrop-blur-md sm:p-2">
                        <SearchWidget initialFilters={filters} compact />
                    </div>
                </div>
            </div>

            {/* Main Content with Negative Margin for overlap effect */}
            <main className="relative z-20 container mx-auto -mt-20 mb-4 px-2 sm:px-4">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:col-span-3 lg:block">
                        <div className="sticky top-24 space-y-4">
                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <FilterSidebar filters={activeFilters} onFilterChange={handleFilterChange} tripTypes={trip_types} />
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="mt-6 lg:col-span-9">
                        {/* Results Header & Mobile Filter */}
                        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Hasil Pencarian</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {schedules.total} jadwal ditemukan untuk{' '}
                                    <span className="font-bold">
                                        {activeFilters.trip_type_id && activeFilters.trip_type_id.length > 0
                                            ? trip_types
                                                  .filter((t) => activeFilters.trip_type_id?.includes(t.id))
                                                  .map((t) => t.name)
                                                  .join(', ')
                                            : 'Semua Trip'}
                                    </span>
                                </p>
                            </div>

                            {/* Mobile Filter Button */}
                            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                                <DrawerTrigger asChild>
                                    <Button variant="outline" className="text-slate-700 lg:hidden dark:text-slate-200">
                                        <Filter className="mr-2 size-4" />
                                        Filter
                                    </Button>
                                </DrawerTrigger>
                                <DrawerContent className="px-4 pb-8">
                                    <div className="mx-auto mt-4 mb-6 h-1 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
                                    <div className="px-2">
                                        <FilterSidebar
                                            filters={activeFilters}
                                            onFilterChange={handleFilterChange}
                                            onApply={() => setDrawerOpen(false)}
                                            tripTypes={trip_types}
                                        />
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        </div>

                        {/* Schedule Cards */}
                        {schedules.data.length > 0 ? (
                            <div className="mt-4 space-y-4">
                                {schedules.data.map((schedule, index) => (
                                    <ScheduleCard key={schedule.id} schedule={schedule} index={index} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState />
                        )}

                        {/* Pagination */}
                        {schedules.last_page > 1 && (
                            <div className="mt-8 flex justify-center">
                                <Pagination>
                                    <PaginationContent>
                                        {schedules.links[0]?.url && (
                                            <PaginationItem>
                                                <PaginationPrevious href={schedules.links[0].url} />
                                            </PaginationItem>
                                        )}

                                        {schedules.links.slice(1, -1).map((link, index) => {
                                            // Skip ellipsis markers
                                            if (link.label === '...') {
                                                return (
                                                    <PaginationItem key={`ellipsis-${index}`}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                );
                                            }

                                            // Skip if no URL
                                            if (!link.url) return null;

                                            return (
                                                <PaginationItem key={index}>
                                                    <PaginationLink href={link.url as string} isActive={link.active}>
                                                        {link.label}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })}

                                        {schedules.links[schedules.links.length - 1]?.url && (
                                            <PaginationItem>
                                                <PaginationNext href={schedules.links[schedules.links.length - 1].url} />
                                            </PaginationItem>
                                        )}
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </AppLayout>
    );
}
