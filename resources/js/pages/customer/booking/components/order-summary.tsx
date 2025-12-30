import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Anchor, Calendar, Clock, MapPin, Shield, Ship } from 'lucide-react';
import type { Schedule } from '../types';
import { formatCurrency, formatDateShort, formatTime } from '../utils';

interface OrderSummaryProps {
    schedule: Schedule;
    passengers: number;
    discount?: number;
    serviceFee?: number;
}

export function OrderSummary({ schedule, passengers, discount = 0, serviceFee = 5000 }: OrderSummaryProps) {
    const basePrice = parseFloat(schedule.route.pricelists?.[0]?.price_public || '150000');
    const subtotal = basePrice * passengers;
    const total = subtotal + serviceFee - discount;

    // Parse route name (e.g. "Kendari - Wakatobi")
    const routeParts = schedule.route.name.split(' - ');
    const origin = routeParts[0] || 'Kendari';
    const destination = routeParts[1] || routeParts[0] || 'Wakatobi';

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none">
            {/* Trip Header */}
            <div className="mb-4">
                <div className="mb-2 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                    <MapPin className="size-4 text-primary" />
                    <span>{origin}</span>
                    <span className="text-slate-400">→</span>
                    <Anchor className="size-4 text-primary" />
                    <span>{destination}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                    {schedule.trip_type?.name || 'Regular'}
                </Badge>
            </div>

            {/* Trip Details */}
            <div className="mb-4 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Calendar className="size-4" />
                    <span>{formatDateShort(schedule.departure_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Clock className="size-4" />
                    <span>{formatTime(schedule.departure_time)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Ship className="size-4" />
                    <span>{schedule.ship.name}</span>
                </div>
            </div>

            <Separator className="my-4" />

            {/* Price Breakdown */}
            <div className="mb-4 space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Dewasa × {passengers}</span>
                    <span className="text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Biaya Layanan</span>
                    <span className="text-slate-900 dark:text-white">{formatCurrency(serviceFee)}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between">
                        <span className="text-green-600 dark:text-green-400">Diskon (Promo)</span>
                        <span className="font-medium text-green-600 dark:text-green-400">-{formatCurrency(discount)}</span>
                    </div>
                )}
            </div>

            <Separator className="my-4" />

            {/* Total */}
            <div className="mb-6 flex items-center justify-between">
                <span className="font-medium text-slate-700 dark:text-slate-300">Total Pembayaran</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(total)}</span>
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
                <Shield className="size-5" />
                <span>Transaksi 100% Aman dengan Xendit</span>
            </div>
        </div>
    );
}
