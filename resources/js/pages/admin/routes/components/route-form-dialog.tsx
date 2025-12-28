import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimeInput } from '@/components/ui/time-input';
import { useForm } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { TripRoute, Waypoint } from '../types';

interface RouteFormDialogProps {
    open: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    initialData?: TripRoute | null;
    activeBranchName: string;
}

export function RouteFormDialog({ open, onClose, mode, initialData, activeBranchName }: RouteFormDialogProps) {
    const isEdit = mode === 'edit';

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        duration_minutes: '' as string | number,
        status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
        waypoints: [] as Waypoint[],
    });

    // Reset form when dialog opens/closes or mode changes
    useEffect(() => {
        if (open) {
            if (isEdit && initialData) {
                setData({
                    name: initialData.name,
                    duration_minutes: initialData.duration_minutes,
                    status: initialData.status,
                    waypoints: initialData.waypoints || [],
                });
            } else {
                reset();
                setData({
                    name: '',
                    duration_minutes: '',
                    status: 'ACTIVE',
                    waypoints: [],
                });
            }
            clearErrors();
        }
    }, [open, initialData, mode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && initialData) {
            put(route('admin.trip-routes.update', initialData.id), {
                onSuccess: () => {
                    onClose();
                    toast.success('Route updated successfully');
                },
                onError: () => toast.error('Failed to update route'),
            });
        } else {
            post(route('admin.trip-routes.store'), {
                onSuccess: () => {
                    onClose();
                    reset();
                    toast.success('Route created successfully');
                },
                onError: () => toast.error('Failed to create route'),
            });
        }
    };

    // Waypoint Helpers
    const addWaypoint = () => {
        setData('waypoints', [...data.waypoints, { name: '', time: '' }]);
    };
    const removeWaypoint = (index: number) => {
        const newWaypoints = [...data.waypoints];
        newWaypoints.splice(index, 1);
        setData('waypoints', newWaypoints);
    };
    const updateWaypoint = (index: number, field: keyof Waypoint, value: string) => {
        const newWaypoints = [...data.waypoints];
        newWaypoints[index][field] = value;
        setData('waypoints', newWaypoints);
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Route' : 'Create New Route'}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? `Update details for ${initialData?.name}.` : `Define a new travel route for ${activeBranchName}.`}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="name">Route Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Jepara - Karimunjawa"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration (mins)</Label>
                            <Input
                                id="duration"
                                type="number"
                                placeholder="120"
                                value={data.duration_minutes}
                                onChange={(e) => setData('duration_minutes', e.target.value)}
                                required
                                min="1"
                            />
                            {errors.duration_minutes && <p className="text-xs text-destructive">{errors.duration_minutes}</p>}
                        </div>
                    </div>

                    {isEdit && (
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={(val: any) => setData('status', val)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Waypoints / Stops</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addWaypoint} className="h-7 text-xs">
                                <Plus className="mr-1 h-3 w-3" /> Add Stop
                            </Button>
                        </div>
                        <div className="space-y-2 rounded-md border bg-muted/20 p-3">
                            {data.waypoints.length === 0 && (
                                <p className="py-4 text-center text-xs text-muted-foreground italic">
                                    {isEdit ? 'No waypoints formatted.' : 'No waypoints added (Direct route)'}
                                </p>
                            )}
                            {data.waypoints.map((wp, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                        {i + 1}
                                    </div>
                                    <Input
                                        placeholder="Stop Name"
                                        className="h-8 flex-1 text-sm"
                                        value={wp.name}
                                        onChange={(e) => updateWaypoint(i, 'name', e.target.value)}
                                        required
                                    />
                                    <TimeInput
                                        value={wp.time}
                                        onChange={(val) => updateWaypoint(i, 'time', val)}
                                        hourRange={{ from: 0, to: 23 }}
                                        className="h-8 w-24"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => removeWaypoint(i)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {isEdit ? 'Save Changes' : 'Create Route'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
