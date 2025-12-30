import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import type { SearchFilters, TripType } from '../types';

interface FilterSidebarProps {
    filters: SearchFilters;
    onFilterChange: (filters: SearchFilters) => void;
    onApply?: () => void;
    tripTypes: TripType[];
}

export function FilterSidebar({ filters, onFilterChange, onApply, tripTypes }: FilterSidebarProps) {
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
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Filter</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="h-8 px-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                    <RotateCcw className="mr-2 size-3" />
                    Reset
                </Button>
            </div>

            {/* Departure Time (Trip Types) */}
            <div>
                <h4 className="mb-4 text-sm font-medium text-slate-700 dark:text-slate-300">Waktu Jadwal</h4>
                <div className="space-y-3">
                    {tripTypes.map((type) => (
                        <div key={type.id} className="flex items-center space-x-3">
                            <Checkbox
                                id={`type-${type.id}`}
                                checked={localFilters.trip_type_id?.includes(type.id)}
                                onCheckedChange={() => toggleArrayFilter('trip_type_id', type.id as never)}
                            />
                            <Label htmlFor={`type-${type.id}`} className="cursor-pointer text-sm text-slate-600 dark:text-slate-400">
                                {type.name}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ship Class and Facilities sections disabled for now
            <Separator className="my-4" />
            ... (existing disabled code)
            */}

            {/* Mobile Apply Button */}
            {onApply && (
                <div className="pt-4 lg:hidden">
                    <Button
                        onClick={onApply}
                        className="w-full bg-orange-600 font-bold text-white hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
                    >
                        Tampilkan Hasil
                    </Button>
                </div>
            )}
        </div>
    );
}
