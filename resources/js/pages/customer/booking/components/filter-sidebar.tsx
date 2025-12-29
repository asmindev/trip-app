import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import type { SearchFilters } from '../types';

interface FilterSidebarProps {
    filters: SearchFilters;
    onFilterChange: (filters: SearchFilters) => void;
}

export function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
    const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

    const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const toggleArrayFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K] extends (infer U)[] | undefined ? U : never) => {
        const currentArray = (localFilters[key] as unknown[]) || [];
        const newArray = currentArray.includes(value) ? currentArray.filter((v) => v !== value) : [...currentArray, value];
        updateFilter(key, newArray as SearchFilters[K]);
    };

    const resetFilters = () => {
        const reset: SearchFilters = {};
        setLocalFilters(reset);
        onFilterChange(reset);
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Filter</h3>
                <Button variant="ghost" size="sm" onClick={resetFilters} className="text-slate-500 hover:text-slate-700">
                    <RotateCcw className="mr-2 size-4" />
                    Reset
                </Button>
            </div>

            {/* Departure Time */}
            <div className="mb-6">
                <h4 className="mb-4 text-sm font-medium text-slate-700 dark:text-slate-300">Waktu Berangkat</h4>
                <div className="space-y-3">
                    {[
                        { value: 'morning', label: 'Pagi (05:00 - 12:00)' },
                        { value: 'afternoon', label: 'Siang (12:00 - 18:00)' },
                        { value: 'night', label: 'Malam (18:00 - 05:00)' },
                    ].map((time) => (
                        <div key={time.value} className="flex items-center space-x-3">
                            <Checkbox
                                id={`time-${time.value}`}
                                checked={localFilters.departureTime?.includes(time.value as 'morning' | 'afternoon' | 'night')}
                                onCheckedChange={() => toggleArrayFilter('departureTime', time.value as 'morning' | 'afternoon' | 'night')}
                            />
                            <Label htmlFor={`time-${time.value}`} className="cursor-pointer text-sm text-slate-600 dark:text-slate-400">
                                {time.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ship Class and Facilities sections disabled for now
            <Separator className="my-4" />

            <div className="mb-6">
                <h4 className="mb-4 text-sm font-medium text-slate-700 dark:text-slate-300">Kelas Kapal</h4>
                <div className="space-y-3">
                    {[
                        { value: 'ECONOMY', label: 'Economy' },
                        { value: 'VIP', label: 'VIP' },
                        { value: 'VVIP', label: 'VVIP' },
                    ].map((cls) => (
                        <div key={cls.value} className="flex items-center space-x-3">
                            <Checkbox
                                id={`class-${cls.value}`}
                                checked={localFilters.shipClass?.includes(cls.value as 'ECONOMY' | 'VIP' | 'VVIP')}
                                onCheckedChange={() => toggleArrayFilter('shipClass', cls.value as 'ECONOMY' | 'VIP' | 'VVIP')}
                            />
                            <Label htmlFor={`class-${cls.value}`} className="cursor-pointer text-sm text-slate-600 dark:text-slate-400">
                                {cls.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator className="my-4" />

            <div>
                <h4 className="mb-4 text-sm font-medium text-slate-700 dark:text-slate-300">Fasilitas</h4>
                <div className="space-y-4">
                    {[
                        { value: 'ac', label: 'AC' },
                        { value: 'cafeteria', label: 'Kafetaria' },
                        { value: 'outdoor', label: 'Deck Outdoor' },
                    ].map((facility) => (
                        <div key={facility.value} className="flex items-center justify-between">
                            <Label htmlFor={`facility-${facility.value}`} className="cursor-pointer text-sm text-slate-600 dark:text-slate-400">
                                {facility.label}
                            </Label>
                            <Switch
                                id={`facility-${facility.value}`}
                                checked={localFilters.facilities?.includes(facility.value)}
                                onCheckedChange={() => toggleArrayFilter('facilities', facility.value)}
                            />
                        </div>
                    ))}
                </div>
            </div>
            */}
        </div>
    );
}
