import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { ReactNode } from 'react';

interface DataTableToolbarProps {
    search?: string;
    onSearch?: (value: string) => void;
    perPage: number;
    onPerPageChange: (value: string) => void;
    perPageOptions?: number[];
    children?: ReactNode;
    className?: string; // Allow custom classes
}

export function DataTableToolbar({
    search,
    onSearch,
    perPage,
    onPerPageChange,
    perPageOptions = [10, 20, 50, 100],
    children,
    className
}: DataTableToolbarProps) {
    return (
        <div className={`flex flex-wrap items-center gap-2 ${className}`}>
            {onSearch && (
                <div className="relative">
                    <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari data..."
                        value={search || ''}
                        onChange={(event) => onSearch(event.target.value)}
                        className="h-9 w-[150px] pl-9 lg:w-[250px]"
                    />
                </div>
            )}
            {children}
            <div className="flex items-center gap-2 ml-auto lg:ml-0">
                 {/* Optional: 'ml-auto' to push it to right if needed, but in single flow it's just next item. */}
                <Select
                    value={perPage.toString()}
                    onValueChange={onPerPageChange}
                >
                    <SelectTrigger className="h-9 w-[70px]">
                        <SelectValue placeholder={perPage} />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {perPageOptions.map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
