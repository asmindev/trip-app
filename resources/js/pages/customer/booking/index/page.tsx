import { Button } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Filter } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '../components/empty-state';
import { FilterSidebar } from '../components/filter-sidebar';
import { ScheduleCard } from '../components/schedule-card';
import { SearchWidget } from '../components/search-widget';
import type { Schedule, SearchFilters } from '../types';

interface PageProps {
    schedules: PaginatedData<Schedule>;
    filters?: Partial<SearchFilters>;
}

export default function BookingIndexPage({ schedules, filters = {} }: PageProps) {
    const { props } = usePage();
    const globalSettings = props.app_settings as { app_name?: string } | undefined;
    const appName = globalSettings?.app_name || 'Kapal Trip';
    const [activeFilters, setActiveFilters] = useState<SearchFilters>(filters);

    const handleFilterChange = (newFilters: SearchFilters) => {
        setActiveFilters(newFilters);
        // In a real app, this would trigger a new search
        // router.reload({ only: ['schedules'], data: { filters: newFilters } });
    };

    return (
        <AppLayout>
            <Head title={`Cari Jadwal Kapal - ${appName}`} />

            {/* Search Widget Header */}
            <div className="border-b border-slate-200 bg-white pt-20 dark:border-slate-800 dark:bg-slate-900">
                <div className="container mx-auto px-4 py-6">
                    <SearchWidget initialFilters={filters} compact />
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:col-span-3 lg:block">
                        <div className="sticky top-24">
                            <FilterSidebar filters={activeFilters} onFilterChange={handleFilterChange} />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-9">
                        {/* Results Header */}
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Jadwal Tersedia</h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{schedules.total} jadwal ditemukan</p>
                            </div>

                            {/* Mobile Filter Button */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="lg:hidden">
                                        <Filter className="mr-2 size-4" />
                                        Filter
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[320px] overflow-y-auto">
                                    <SheetHeader>
                                        <SheetTitle>Filter Pencarian</SheetTitle>
                                    </SheetHeader>
                                    <div className="mt-6">
                                        <FilterSidebar filters={activeFilters} onFilterChange={handleFilterChange} />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Schedule Cards */}
                        {schedules.data.length > 0 ? (
                            <div className="space-y-4">
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
