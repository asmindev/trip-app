import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Clock } from 'lucide-react';

export interface TimeInputProps {
    value?: string;
    onChange?: (value: string) => void;
    hourRange?: { from: number; to: number };
    className?: string;
    disabled?: boolean;
}

const TimeInput = React.forwardRef<HTMLDivElement, TimeInputProps>(
    ({ value = '', onChange, hourRange = { from: 0, to: 23 }, className, disabled }, ref) => {
        const [isOpen, setIsOpen] = React.useState(false);

        // Parse value
        const parseTime = (val: string) => {
            const [h, m] = val.split(':').map(Number);
            return {
                hour: isNaN(h) ? 0 : h,
                minute: isNaN(m) ? 0 : m
            };
        };

        const { hour, minute } = parseTime(value);

        // Generate data
        const hours = Array.from({ length: 24 }, (_, i) => i).filter(
            h => h >= hourRange.from && h <= hourRange.to
        );
        const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10...

        const handleTimeChange = (type: 'hour' | 'minute', val: number) => {
            let newH = hour;
            let newM = minute;

            if (type === 'hour') newH = val;
            if (type === 'minute') newM = val;

            // Ensure hour is within range if we somehow switched to an out-of-range state
            if (newH < hourRange.from) newH = hourRange.from;
            if (newH > hourRange.to) newH = hourRange.to;

            const timeStr = `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
            onChange?.(timeStr);
        };

        return (
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isOpen}
                        className={cn(
                            "w-full justify-start text-left font-normal px-3",
                            !value && "text-muted-foreground",
                            className
                        )}
                        disabled={disabled}
                    >
                        <Clock className="mr-2 h-4 w-4 opacity-50" />
                        {value ? value : <span>Select time</span>}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-0" align="end">
                    <div className="flex h-64 divide-x">
                        {/* Hours Column */}
                        <div className="flex flex-col overflow-y-auto w-16 p-2 relative">
                            <span className="text-xs font-semibold text-muted-foreground text-center mb-2 sticky -top-2 bg-popover py-1">Hrs</span>
                            <div className="flex flex-col gap-1">
                                {hours.map((h) => (
                                    <Button
                                        key={h}
                                        variant={h === hour ? "default" : "ghost"}
                                        size="sm"
                                        className="h-8 justify-center shrink-0"
                                        onClick={() => handleTimeChange('hour', h)}
                                    >
                                        {h.toString().padStart(2, '0')}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Minutes Column */}
                         <div className="flex flex-col overflow-y-auto w-16 p-2 relative">
                            <span className="text-xs font-semibold text-muted-foreground text-center mb-2 sticky -top-2 bg-popover py-1">Min</span>
                            <div className="flex flex-col gap-1">
                                {minutes.map((m) => (
                                    <Button
                                        key={m}
                                        variant={m === minute ? "default" : "ghost"}
                                        size="sm"
                                        className="h-8 justify-center shrink-0"
                                        onClick={() => handleTimeChange('minute', m)}
                                    >
                                        {m.toString().padStart(2, '0')}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    },
);

TimeInput.displayName = 'TimeInput';

export { TimeInput };
