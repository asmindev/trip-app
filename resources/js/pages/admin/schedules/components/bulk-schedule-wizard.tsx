import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn, formatDate } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react'; // Use router for posting custom data
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { TripType } from '../types';

import { TripRoute } from '@/pages/admin/routes/types';
import { Ship } from '@/pages/admin/ships/components/schema';

interface BulkScheduleWizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ships: Ship[];
    routes: TripRoute[];
    tripTypes: TripType[];
}

const steps = ['Configuration', 'Review & Generate'];

export function BulkScheduleWizard({ open, onOpenChange, ships, routes, tripTypes }: BulkScheduleWizardProps) {
    const [step, setStep] = useState(0);
    const [previewDates, setPreviewDates] = useState<Date[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    // Form Schema
    // Usually we define this outside or import it
    const formSchema = z.object({
        trip_route_id: z.number().min(1, 'Route is required'),
        trip_type_id: z.number().min(1, 'Trip Type is required'),
        ship_id: z.number().min(1, 'Ship is required'),
        start_date: z.date({ message: 'Start date is required' }),
        end_date: z.date({ message: 'End date is required' }),
        departure_time: z.string().min(1, 'Time is required'),
        days_of_week: z.array(z.number()).min(1, 'Select at least one day'),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            days_of_week: [],
        },
    });

    const calculatePreview = () => {
        const data = form.getValues();
        // Simple client-side preview calculation
        const dates: Date[] = [];
        const current = new Date(data.start_date);
        const end = new Date(data.end_date);

        while (current <= end) {
            if (data.days_of_week.includes(current.getDay())) {
                dates.push(new Date(current));
            }
            current.setDate(current.getDate() + 1);
        }
        setPreviewDates(dates);
        setStep(1);
    };

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setIsGenerating(true);
        router.post(route('admin.schedules.bulk-store'), data, {
            onSuccess: () => {
                setIsGenerating(false);
                onOpenChange(false);
                setStep(0);
                form.reset();
            },
            onError: () => setIsGenerating(false),
        });
    };

    const days = [
        { label: 'Sun', value: 0 },
        { label: 'Mon', value: 1 },
        { label: 'Tue', value: 2 },
        { label: 'Wed', value: 3 },
        { label: 'Thu', value: 4 },
        { label: 'Fri', value: 5 },
        { label: 'Sat', value: 6 },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Bulk Schedule Generator</DialogTitle>
                    <DialogDescription>Generate multiple recurring schedules at once.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {step === 0 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="trip_route_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Route</FormLabel>
                                                <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Route" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {routes.map((r) => (
                                                            <SelectItem key={r.id} value={String(r.id)}>
                                                                {r.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="ship_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ship</FormLabel>
                                                <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Ship" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {ships.map((s) => (
                                                            <SelectItem key={s.id} value={String(s.id)}>
                                                                {s.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="trip_type_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Trip Type</FormLabel>
                                            <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={field.value?.toString()}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {tripTypes.map((t) => (
                                                        <SelectItem key={t.id} value={String(t.id)}>
                                                            {t.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="start_date"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Start Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={'outline'}
                                                                className={cn(
                                                                    'w-full pl-3 text-left font-normal',
                                                                    !field.value && 'text-muted-foreground',
                                                                )}
                                                            >
                                                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="end_date"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>End Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={'outline'}
                                                                className={cn(
                                                                    'w-full pl-3 text-left font-normal',
                                                                    !field.value && 'text-muted-foreground',
                                                                )}
                                                            >
                                                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="departure_time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Departure Time</FormLabel>
                                            <FormControl>
                                                <Input type="time" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="days_of_week"
                                    render={() => (
                                        <FormItem>
                                            <div className="mb-4">
                                                <FormLabel className="text-base">Days of Week</FormLabel>
                                                <DialogDescription>Select the days the ship will depart.</DialogDescription>
                                            </div>
                                            <div className="grid grid-cols-4 gap-2">
                                                {days.map((item) => (
                                                    <FormField
                                                        key={item.value}
                                                        control={form.control}
                                                        name="days_of_week"
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem key={item.value} className="flex flex-row items-start space-y-0 space-x-3">
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(item.value)}
                                                                            onCheckedChange={(checked) => {
                                                                                return checked
                                                                                    ? field.onChange([...field.value, item.value])
                                                                                    : field.onChange(
                                                                                          field.value?.filter((value) => value !== item.value),
                                                                                      );
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal">{item.label}</FormLabel>
                                                                </FormItem>
                                                            );
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-4">
                                <div className="rounded-md border p-4">
                                    <h4 className="mb-2 font-medium">Preview Generation</h4>
                                    <p className="text-sm text-muted-foreground">
                                        You are about to generate <strong>{previewDates.length}</strong> schedules.
                                    </p>
                                    <div className="mt-4 max-h-[200px] overflow-y-auto">
                                        <ul className="list-inside list-disc text-sm">
                                            {previewDates.map((d, i) => (
                                                <li key={i}>
                                                    {formatDate(d.toISOString())} at {form.getValues('departure_time')}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            {step === 0 ? (
                                <Button type="button" onClick={form.handleSubmit(calculatePreview)}>
                                    Next: Preview
                                </Button>
                            ) : (
                                <>
                                    <Button type="button" variant="ghost" onClick={() => setStep(0)}>
                                        Back
                                    </Button>
                                    <Button type="submit" disabled={isGenerating}>
                                        {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Generate {previewDates.length} Schedules
                                    </Button>
                                </>
                            )}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
