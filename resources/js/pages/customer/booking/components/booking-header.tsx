import { Ship } from 'lucide-react';
import { motion } from 'motion/react';
import type { Schedule } from '../types';

interface BookingHeaderProps {
    schedule: Schedule;
    appName: string;
}

export function BookingHeader({ schedule, appName }: BookingHeaderProps) {
    return (
        <div className="relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 py-20 lg:py-28">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute -top-24 -left-20 size-96 rounded-full bg-orange-500/20 blur-3xl" />
                <div className="absolute -right-20 -bottom-24 size-96 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
            </div>

            <div className="relative z-10 container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-white/10 shadow-2xl ring-1 ring-white/20 backdrop-blur-xl"
                >
                    <Ship className="size-8 text-primary drop-shadow-lg" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-4 text-3xl font-black tracking-tight text-white md:text-5xl"
                >
                    Selesaikan <span className="text-primary italic">Pemesanan</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mx-auto max-w-xl text-lg font-medium text-slate-400"
                >
                    {schedule.route?.name || `Tiket perjalanan Anda bersama ${appName}`}
                </motion.p>

                {/* Floating Stats or Info could go here */}
            </div>

            {/* Bottom Curve/Divider */}
            <div className="absolute right-0 bottom-0 left-0 h-24 bg-linear-to-t from-slate-50 to-transparent dark:from-slate-950" />
        </div>
    );
}
