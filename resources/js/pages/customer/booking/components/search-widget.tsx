import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon, Minus, Plus, Search, Users } from 'lucide-react';
import { useState } from 'react';
import type { SearchFilters } from '../types';

interface SearchWidgetProps {
    initialFilters?: Partial<SearchFilters>;
    compact?: boolean;
}

export function SearchWidget({ initialFilters, compact = false }: SearchWidgetProps) {
    const [date, setDate] = useState<Date | undefined>(initialFilters?.date ? new Date(initialFilters.date) : undefined);
    const [passengers, setPassengers] = useState(initialFilters?.passengers || 1);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (date) params.set('filter[departure_date]', format(date, 'yyyy-MM-dd'));
        if (passengers > 1) params.set('passengers', passengers.toString());

        router.visit(`/booking?${params.toString()}`);
    };

    return (
        <div className="flex flex-col gap-4 rounded-xl border bg-background p-3 shadow-sm sm:p-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-2">
                {/* Date */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Tanggal Keberangkatan</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-11 w-full justify-start rounded-xl bg-slate-50 text-left font-normal dark:bg-slate-800"
                            >
                                <CalendarIcon className="mr-2 size-4 text-primary" />
                                {date ? format(date, 'd MMM yyyy', { locale: id }) : 'Pilih tanggal'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Passengers */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Jumlah Penumpang</label>
                    <div className="flex h-11 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center gap-2">
                            <Users className="size-4 text-primary" />
                            <span className="flex items-center gap-2 text-sm font-medium">
                                {passengers} <p className="hidden sm:block">orang</p>
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                onClick={() => setPassengers(Math.max(1, passengers - 1))}
                                disabled={passengers <= 1}
                            >
                                <Minus className="size-3" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                onClick={() => setPassengers(Math.min(50, passengers + 1))}
                                disabled={passengers >= 50}
                            >
                                <Plus className="size-3" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Button */}
            <Button onClick={handleSearch} className={cn('bg-primary hover:bg-primary/90', compact ? 'mt-0 h-11 px-6' : 'mt-4 h-12 w-full')}>
                <Search className="mr-2 size-4" />
                Cari Jadwal
            </Button>
        </div>
    );
}
