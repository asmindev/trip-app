import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Anchor, ChevronRight, Clock, MapPin, Ship, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import type { Schedule } from '../types';
import { calculateDuration, formatCurrency, formatTime } from '../utils';

interface ScheduleCardProps {
    schedule: Schedule;
    index?: number;
}

export function ScheduleCard({ schedule, index = 0 }: ScheduleCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const price = schedule.route.pricelists?.[0]?.price_public || '0';
    const isLowAvailability = schedule.available_seats <= 5;
    const arrivalTime = schedule.arrival_time || '11:30';
    const duration = calculateDuration(schedule.departure_time, arrivalTime);

    // Parse route name (e.g. "Kendari - Wakatobi")
    const routeParts = schedule.route.name.split(' - ');
    const origin = routeParts[0] || 'Kendari';
    const destination = routeParts[1] || routeParts[0] || 'Wakatobi';

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
            <div
                className="group cursor-pointer rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10 sm:p-5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-500/30 dark:hover:shadow-orange-900/20"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {/* Main Content Row */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    {/* Left: Ship Info */}
                    <div className="flex items-center gap-4">
                        <div className="flex size-12 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-900/30">
                            <Ship className="size-6 text-primary" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-900 dark:text-white">{schedule.ship.name}</h3>
                                <Badge
                                    variant="outline"
                                    className="bg-slate-50 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                >
                                    {schedule.trip_type?.name || 'Regular'}
                                </Badge>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Regular Trip</p>
                        </div>
                    </div>

                    {/* Center: Timeline */}
                    <div className="flex flex-1 items-center justify-center gap-3 py-2 md:px-8">
                        {/* Departure */}
                        <div className="text-center">
                            <div className="text-xl font-bold text-slate-900 dark:text-white">{formatTime(schedule.departure_time)}</div>
                            <div className="flex items-center justify-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                                <MapPin className="size-3" />
                                <span>{origin}</span>
                            </div>
                        </div>

                        {/* Timeline Graphic */}
                        <div className="flex flex-1 flex-col items-center px-2">
                            <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                                <Clock className="size-3" />
                                <span>{duration}</span>
                            </div>
                            <div className="relative my-1 h-0.5 w-full bg-slate-200 dark:bg-slate-700">
                                <div className="absolute top-1/2 left-0 size-2 -translate-y-1/2 rounded-full bg-primary" />
                                <div className="absolute top-1/2 right-0 size-2 -translate-y-1/2 rounded-full bg-primary" />
                            </div>
                            <div className="text-xs text-slate-400">Langsung</div>
                        </div>

                        {/* Arrival */}
                        <div className="text-center">
                            <div className="text-xl font-bold text-slate-900 dark:text-white">{formatTime(arrivalTime)}</div>
                            <div className="flex items-center justify-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                                <Anchor className="size-3" />
                                <span>{destination}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Price & CTA */}
                    <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 md:flex-col md:items-end md:border-t-0 md:pt-0 dark:border-slate-800">
                        <div className="text-right">
                            <div className="text-xl font-bold text-orange-600 dark:text-orange-400">{formatCurrency(price)}</div>
                            <div className="flex items-center gap-1 text-sm">
                                <Users className="size-3" />
                                {isLowAvailability ? (
                                    <span className="font-medium text-red-600 dark:text-red-400">Sisa {schedule.available_seats} kursi</span>
                                ) : (
                                    <span className="font-medium text-green-600 dark:text-green-400">
                                        Tersedia {schedule.available_seats} / {schedule.ship.capacity}
                                    </span>
                                )}
                            </div>
                        </div>
                        <Link href={route('booking.create', schedule.id)}>
                            <Button className="bg-primary text-white hover:bg-primary/90">
                                Pilih
                                <ChevronRight className="ml-1 size-4" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                        >
                            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div>
                                        <div className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">Fasilitas</div>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="secondary" className="text-xs">
                                                AC
                                            </Badge>
                                            <Badge variant="secondary" className="text-xs">
                                                Kafetaria
                                            </Badge>
                                            <Badge variant="secondary" className="text-xs">
                                                Deck Outdoor
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">Rute Perjalanan</div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            {schedule.route.origin || 'Kendari'} → {schedule.route.destination || 'Wakatobi'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">Kapasitas</div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">{schedule.ship.capacity} penumpang</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
