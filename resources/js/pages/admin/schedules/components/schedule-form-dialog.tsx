import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useForm as useInertiaForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { Schedule, ScheduleFormData, TripType } from '../types';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { TripRoute } from '@/pages/admin/routes/types';
import { Ship } from '@/pages/admin/ships/components/schema';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

interface ScheduleFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    schedule: Schedule | null;
    ships: Ship[];
    routes: TripRoute[];
    tripTypes: TripType[];
}

export function ScheduleFormDialog({ open, onOpenChange, schedule, ships, routes, tripTypes }: ScheduleFormDialogProps) {
    const isEdit = !!schedule;
    const [openRouteCombobox, setOpenRouteCombobox] = useState(false);
    const [openShipCombobox, setOpenShipCombobox] = useState(false);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useInertiaForm<ScheduleFormData>({
        trip_route_id: 0,
        trip_type_id: 0,
        ship_id: 0,
        departure_date: undefined,
        departure_time: '',
        available_seats: 0,
        status: 'SCHEDULED', // Default
    });

    useEffect(() => {
        if (schedule) {
            setData({
                trip_route_id: schedule.trip_route_id,
                trip_type_id: schedule.trip_type_id,
                ship_id: schedule.ship_id,
                departure_date: new Date(schedule.departure_date),
                departure_time: schedule.departure_time,
                available_seats: schedule.available_seats,
                status: schedule.status,
            });
        } else {
            reset();
            clearErrors();
        }
    }, [schedule, open]);

    // Derived lists based on selections (e.g., filter ships by branch of selected route)
    // NOTE: For now assume global lists, but ideally implementation should enforce branch consistency

    // Auto-fill capacity when ship is selected
    const handleShipChange = (shipId: string) => {
        const id = parseInt(shipId);
        setData('ship_id', id);

        // Find ship capacity
        const ship = ships.find((s) => s.id === id);
        if (ship && !isEdit) {
            setData((data) => ({ ...data, ship_id: id, available_seats: ship.capacity }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && schedule) {
            put(route('admin.schedules.update', schedule.id), {
                onSuccess: () => onOpenChange(false),
            });
        } else {
            post(route('admin.schedules.store'), {
                onSuccess: () => onOpenChange(false),
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:min-w-250">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Schedule' : 'Create Schedule'}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Update existing schedule parameters.' : 'Add a new departure schedule for a ship.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Route Selection (Combobox) */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium">Route</label>
                            <Popover open={openRouteCombobox} onOpenChange={setOpenRouteCombobox}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openRouteCombobox}
                                        className="w-full justify-between font-normal"
                                    >
                                        {data.trip_route_id ? routes.find((r) => r.id === data.trip_route_id)?.name : 'Select Route...'}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search route..." />
                                        <CommandList>
                                            <CommandEmpty>No route found.</CommandEmpty>
                                            <CommandGroup>
                                                {routes.map((r) => (
                                                    <CommandItem
                                                        key={r.id}
                                                        value={r.name}
                                                        onSelect={() => {
                                                            setData('trip_route_id', r.id);
                                                            setOpenRouteCombobox(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn('mr-2 h-4 w-4', data.trip_route_id === r.id ? 'opacity-100' : 'opacity-0')}
                                                        />
                                                        {r.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {errors.trip_route_id && <p className="text-sm text-destructive">{errors.trip_route_id}</p>}
                        </div>

                        {/* Ship Selection (Combobox) */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium">Ship</label>
                            <Popover open={openShipCombobox} onOpenChange={setOpenShipCombobox}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openShipCombobox}
                                        className="w-full justify-between font-normal"
                                    >
                                        {data.ship_id ? ships.find((s) => s.id === data.ship_id)?.name : 'Select Ship...'}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search ship..." />
                                        <CommandList>
                                            <CommandEmpty>No ship found.</CommandEmpty>
                                            <CommandGroup>
                                                {ships.map((s) => (
                                                    <CommandItem
                                                        key={s.id}
                                                        value={s.name}
                                                        onSelect={() => {
                                                            handleShipChange(String(s.id)); // Assuming handleShipChange handles the logic
                                                            setOpenShipCombobox(false);
                                                        }}
                                                    >
                                                        <Check className={cn('mr-2 h-4 w-4', data.ship_id === s.id ? 'opacity-100' : 'opacity-0')} />
                                                        {s.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {errors.ship_id && <p className="text-sm text-destructive">{errors.ship_id}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Trip Type */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Trip Type</label>
                            <Select
                                value={data.trip_type_id ? String(data.trip_type_id) : ''}
                                onValueChange={(val) => setData('trip_type_id', parseInt(val))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tripTypes.map((t) => (
                                        <SelectItem key={t.id} value={String(t.id)}>
                                            {t.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.trip_type_id && <p className="text-sm text-destructive">{errors.trip_type_id}</p>}
                        </div>

                        {/* Status (Only Edit) */}
                        {isEdit && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <Select
                                    value={data.status}
                                    onValueChange={(val: 'SCHEDULED' | 'DEPARTED' | 'CANCELLED' | 'COMPLETED') => setData('status', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                                        <SelectItem value="DEPARTED">Departed</SelectItem>
                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Date Picker */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium">Departure Date</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        className={cn('w-full pl-3 text-left font-normal', !data.departure_date && 'text-muted-foreground')}
                                    >
                                        {data.departure_date ? format(data.departure_date, 'PPP') : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={data.departure_date}
                                        onSelect={(date) => setData('departure_date', date)}
                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.departure_date && <p className="text-sm text-destructive">{errors.departure_date}</p>}
                        </div>

                        {/* Time Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Departure Time</label>
                            <Input type="time" value={data.departure_time} onChange={(e) => setData('departure_time', e.target.value)} />
                            {errors.departure_time && <p className="text-sm text-destructive">{errors.departure_time}</p>}
                        </div>
                    </div>

                    {/* Seats */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Available Seats</label>
                        <Input type="number" value={data.available_seats} onChange={(e) => setData('available_seats', parseInt(e.target.value))} />
                        {errors.available_seats && <p className="text-sm text-destructive">{errors.available_seats}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? 'Save Changes' : 'Create Schedule'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
