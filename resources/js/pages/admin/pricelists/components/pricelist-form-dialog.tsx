import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from '@inertiajs/react';
import { Calendar, DollarSign, Loader2, Route, Tag } from 'lucide-react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Pricelist, TripRoute, TripType } from '../types';

interface PricelistFormDialogProps {
    open: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    initialData?: Pricelist | null;
    routes: TripRoute[];
    tripTypes: TripType[];
}

export function PricelistFormDialog({ open, onClose, mode, initialData, routes, tripTypes }: PricelistFormDialogProps) {
    const isEdit = mode === 'edit';

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        trip_route_id: '',
        trip_type_id: '',
        price_public: '',
        price_event: '',
        effective_from: new Date().toISOString().split('T')[0],
        effective_until: '',
        is_active: true,
    });

    useEffect(() => {
        if (open) {
            if (isEdit && initialData) {
                setData({
                    trip_route_id: initialData.trip_route_id.toString(),
                    trip_type_id: initialData.trip_type_id.toString(),
                    price_public: initialData.price_public.toString(),
                    price_event: initialData.price_event.toString(),
                    effective_from: initialData.effective_from,
                    effective_until: initialData.effective_until || '',
                    is_active: initialData.is_active,
                });
            } else {
                reset();
            }
            clearErrors();
        }
    }, [open, initialData, mode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && initialData) {
            put(route('admin.pricelists.update', initialData.id), {
                onSuccess: () => {
                    onClose();
                    toast.success('Price updated successfully');
                },
                onError: () => toast.error('Failed to update price'),
            });
        } else {
            post(route('admin.pricelists.store'), {
                onSuccess: () => {
                    onClose();
                    reset();
                    toast.success('Price created successfully');
                },
                onError: () => toast.error('Failed to create price'),
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[480px]">
                {/* Gradient Header */}
                <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 pb-4">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">{isEdit ? 'Edit Price' : 'New Price'}</DialogTitle>
                        <DialogDescription className="text-muted-foreground/80">
                            {isEdit ? 'Update pricing configuration' : 'Set up a new price for a route'}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 p-6 pt-4">
                    {/* Route & Type Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                <Route className="h-3.5 w-3.5" /> Route
                            </Label>
                            <Select value={data.trip_route_id} onValueChange={(val) => setData('trip_route_id', val)}>
                                <SelectTrigger className="h-10 border-border/50 bg-muted/30 focus:bg-background">
                                    <SelectValue placeholder="Select route" />
                                </SelectTrigger>
                                <SelectContent>
                                    {routes.map((r) => (
                                        <SelectItem key={r.id} value={r.id.toString()}>
                                            {r.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.trip_route_id && <p className="text-xs text-destructive">{errors.trip_route_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                <Tag className="h-3.5 w-3.5" /> Trip Type
                            </Label>
                            <Select value={data.trip_type_id} onValueChange={(val) => setData('trip_type_id', val)}>
                                <SelectTrigger className="h-10 border-border/50 bg-muted/30 focus:bg-background">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tripTypes.map((t) => (
                                        <SelectItem key={t.id} value={t.id.toString()}>
                                            {t.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.trip_type_id && <p className="text-xs text-destructive">{errors.trip_type_id}</p>}
                        </div>
                    </div>

                    {/* Price Inputs */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                <DollarSign className="h-3.5 w-3.5" /> Public Price
                            </Label>
                            <div className="relative">
                                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">Rp</span>
                                <Input
                                    type="number"
                                    className="h-10 border-border/50 bg-muted/30 pl-9 tabular-nums focus:bg-background"
                                    placeholder="0"
                                    value={data.price_public}
                                    onChange={(e) => setData('price_public', e.target.value)}
                                    required
                                />
                            </div>
                            {errors.price_public && <p className="text-xs text-destructive">{errors.price_public}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                <DollarSign className="h-3.5 w-3.5" /> Event Price
                            </Label>
                            <div className="relative">
                                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">Rp</span>
                                <Input
                                    type="number"
                                    className="h-10 border-border/50 bg-muted/30 pl-9 tabular-nums focus:bg-background"
                                    placeholder="0"
                                    value={data.price_event}
                                    onChange={(e) => setData('price_event', e.target.value)}
                                    required
                                />
                            </div>
                            {errors.price_event && <p className="text-xs text-destructive">{errors.price_event}</p>}
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                <Calendar className="h-3.5 w-3.5" /> From
                            </Label>
                            <Input
                                type="date"
                                className="h-10 border-border/50 bg-muted/30 focus:bg-background"
                                value={data.effective_from}
                                onChange={(e) => setData('effective_from', e.target.value)}
                                required
                            />
                            {errors.effective_from && <p className="text-xs text-destructive">{errors.effective_from}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                <Calendar className="h-3.5 w-3.5" /> Until (Optional)
                            </Label>
                            <Input
                                type="date"
                                className="h-10 border-border/50 bg-muted/30 focus:bg-background"
                                value={data.effective_until}
                                onChange={(e) => setData('effective_until', e.target.value)}
                            />
                            {errors.effective_until && <p className="text-xs text-destructive">{errors.effective_until}</p>}
                        </div>
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium">Active Status</Label>
                            <p className="text-xs text-muted-foreground">Enable this price to be used in bookings</p>
                        </div>
                        <Switch checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked)} />
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="gap-2">
                            {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isEdit ? 'Save Changes' : 'Create Price'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
