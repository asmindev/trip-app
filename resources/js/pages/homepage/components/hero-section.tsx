import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@inertiajs/react';
import { ArrowRight, CalendarIcon, Search, Sparkles, Star, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { route } from 'ziggy-js';

interface HeroSettings {
    badge: string;
    headline: string;
    subheadline: string;
    stats: Array<{ value: string; label: string }>;
    image?: string;
    cta_text?: string;
}

interface HeroSectionProps {
    settings?: HeroSettings;
}

const defaultSettings: HeroSettings = {
    badge: '100+ jadwal tersedia hari ini',
    headline: 'Jelajahi Nusantara Tanpa Batas.',
    subheadline: 'Platform booking tiket kapal premium #1 di Indonesia. Cepat, aman, dan terpercaya.',
    stats: [
        { value: '50K+', label: 'Penumpang Puas' },
        { value: '4.9', label: 'Rating Pengguna' },
        { value: '15+', label: 'Rute Tersedia' },
    ],
    cta_text: 'Cari Jadwal',
};

export function HeroSection({ settings }: HeroSectionProps) {
    const data = settings || defaultSettings;
    const [tripType, setTripType] = useState('oneway');

    return (
        <section className="relative min-h-[90vh] overflow-hidden">
            {/* Background with BOLD Orange gradient - Light/Dark optimized */}
            <div className="absolute inset-0">
                {/* BOLD Orange gradient - Brighter for light mode */}
                <div className="absolute inset-0 bg-linear-to-br from-orange-500 via-orange-600 to-orange-800 dark:from-orange-600 dark:via-orange-700 dark:to-slate-900" />

                {/* Optional Hero Image with Overlay */}
                {data.image && (
                    <div className="absolute inset-0 z-0">
                        <img src={data.image} alt="" className="h-full w-full object-cover opacity-10 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-linear-to-t from-orange-950/80 via-transparent to-orange-900/20" />
                    </div>
                )}

                {/* Vibrant Orange mesh overlays - Optimized for light mode */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-orange-300/70 via-orange-400/40 to-transparent dark:from-orange-400/60 dark:via-orange-500/30 dark:to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-yellow-400/40 via-orange-500/30 to-transparent dark:from-orange-500/50 dark:via-slate-800/40 dark:to-transparent" />

                {/* Large Orange glow spots - Enhanced for light mode */}
                <div className="absolute -top-20 -right-20 size-[600px] rounded-full bg-yellow-300/40 blur-3xl dark:bg-orange-500/30" />
                <div className="absolute top-1/3 left-0 size-[500px] rounded-full bg-orange-400/35 blur-3xl dark:bg-primary/25" />
                <div className="absolute right-1/4 bottom-0 size-[400px] rounded-full bg-orange-500/30 blur-3xl dark:bg-orange-600/20" />

                {/* Light overlay - lighter for light mode, darker for dark mode */}
                <div className="absolute inset-0 bg-linear-to-t from-orange-900/40 via-orange-800/20 to-transparent dark:from-slate-900/60 dark:via-slate-900/30 dark:to-transparent" />

                {/* Animated wave pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="absolute bottom-0 h-64 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path
                            fill="white"
                            fillOpacity="0.3"
                            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        />
                    </svg>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 pt-28 pb-8 md:pt-32 md:pb-12">
                <div className="mx-auto max-w-5xl text-center">
                    {/* Live Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8 inline-flex items-center gap-2"
                    >
                        <Badge className="rounded-full border-orange-400/30 bg-primary/20 px-4 py-2 text-white shadow-lg shadow-orange-500/25 backdrop-blur-md hover:bg-primary/30">
                            <span className="relative mr-2 flex size-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                                <span className="relative inline-flex size-2 rounded-full bg-orange-400" />
                            </span>
                            <span className="text-xs font-medium">{data.badge}</span>
                            <Sparkles className="ml-2 size-3 text-orange-300" />
                        </Badge>
                    </motion.div>

                    {/* Main Headline - BOLD ORANGE */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mb-6 text-5xl leading-[1.1] font-extrabold tracking-tighter md:text-6xl lg:text-7xl"
                    >
                        <span className="bg-linear-to-r from-orange-200 via-orange-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                            {data.headline}
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mx-auto mb-12 max-w-2xl text-lg text-orange-50 md:text-xl"
                    >
                        {data.subheadline}
                    </motion.p>

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mx-auto mb-8 grid max-w-lg grid-cols-3 gap-4 md:mb-16 md:gap-8"
                    >
                        {data.stats.map((stat, idx) => (
                            <div
                                key={idx}
                                className="group relative rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 text-center backdrop-blur-sm transition-all hover:border-orange-500/40 hover:bg-orange-500/20"
                            >
                                {/* Orange glow on hover */}
                                <div className="absolute inset-0 rounded-2xl bg-primary/0 opacity-0 blur-xl transition-all group-hover:bg-primary/20 group-hover:opacity-100" />

                                <div className="relative">
                                    <div className="text-3xl font-black text-white md:text-4xl">
                                        {stat.value}
                                        {stat.label === 'Rating Pengguna' && <Star className="ml-1 inline size-5 fill-primary text-primary" />}
                                    </div>
                                    <div className="mt-1 text-sm text-orange-200">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Booking Widget - Inline on mobile, floating on desktop */}
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative z-10 px-4 pb-8 md:absolute md:inset-x-0 md:bottom-0 md:translate-y-1/3 md:px-6 md:pb-0"
            >
                <div className="mx-auto max-w-5xl">
                    <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-2xl md:p-8 dark:border-slate-700/50 dark:bg-slate-900">
                        {/* Tabs */}
                        <Tabs value={tripType} onValueChange={setTripType} className="mb-6">
                            <TabsList className="grid w-full max-w-xs grid-cols-2 bg-slate-100 dark:bg-slate-800">
                                <TabsTrigger value="oneway" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                                    Sekali Jalan
                                </TabsTrigger>
                                <TabsTrigger value="roundtrip" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                                    Pulang Pergi
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {/* Form Grid - Visual only, links to booking page */}
                        <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
                            {/* Date */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Tanggal Keberangkatan</label>
                                <div className="relative flex h-14 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 dark:border-slate-700 dark:bg-slate-800">
                                    <CalendarIcon className="size-5 text-primary" />
                                    <span className="ml-3 text-sm text-muted-foreground">Pilih tanggal</span>
                                </div>
                            </div>

                            {/* Passengers */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Jumlah Penumpang</label>
                                <div className="relative flex h-14 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 dark:border-slate-700 dark:bg-slate-800">
                                    <Users className="size-5 text-primary" />
                                    <span className="ml-3 text-sm font-medium text-slate-900 dark:text-white">1 Orang</span>
                                </div>
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="mt-6">
                            <Link href={route('booking.index')} className="block">
                                <Button
                                    size="lg"
                                    className="group h-14 w-full bg-primary text-base font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] hover:bg-primary/90 hover:shadow-xl hover:shadow-orange-500/30"
                                >
                                    <Search className="mr-2 size-5" />
                                    {data.cta_text || 'Cari Jadwal'}
                                    <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
