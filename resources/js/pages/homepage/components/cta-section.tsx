import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { route } from 'ziggy-js';

interface CTASettings {
    headline: string;
    subheadline: string;
    primary_button: string;
    secondary_button: string;
}

interface CTASectionProps {
    settings?: CTASettings;
}

const defaultSettings: CTASettings = {
    headline: 'Siap Memulai Petualanganmu?',
    subheadline: 'Pesan tiketmu sekarang dan nikmati keindahan alam Sulawesi yang memukau',
    primary_button: 'Pesan Tiket Sekarang',
    secondary_button: 'Hubungi Kami',
};

export function CTASection({ settings }: CTASectionProps) {
    const data = settings || defaultSettings;

    return (
        <section className="relative overflow-hidden py-24 lg:py-32">
            {/* Background - Theme Responsive */}
            <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950" />

            {/* Mesh gradient overlay - Theme Responsive */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent dark:from-primary/30" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-orange-400/10 via-transparent to-transparent dark:from-blue-400/20" />

            {/* Grid pattern - Theme Responsive */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-size-[32px_32px] dark:bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)]" />

            {/* Floating decorations */}
            <div className="absolute top-10 left-10 size-20 animate-pulse rounded-full bg-primary/5 blur-xl dark:bg-white/5" />
            <div
                className="absolute right-10 bottom-10 size-32 animate-pulse rounded-full bg-primary/5 blur-xl dark:bg-white/5"
                style={{ animationDelay: '1s' }}
            />

            <div className="relative container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-3xl space-y-8"
                >
                    {/* Icon */}
                    <div className="mb-6 inline-flex items-center justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                            <div className="relative flex size-16 items-center justify-center rounded-full bg-linear-to-br from-primary to-orange-500 backdrop-blur-sm">
                                <Sparkles className="size-8 text-white" strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 md:text-4xl lg:text-5xl dark:text-white">{data.headline}</h2>
                    <p className="mx-auto max-w-xl text-lg text-slate-600 dark:text-white/80">{data.subheadline}</p>

                    <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
                        <Link href={route('booking.index')}>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    size="lg"
                                    className="group h-14 bg-primary px-8 font-bold text-white shadow-xl shadow-orange-500/20 hover:bg-primary/90 hover:shadow-2xl hover:shadow-orange-500/30"
                                >
                                    {data.primary_button}
                                    <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </motion.div>
                        </Link>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-14 border-2 border-slate-200 bg-white px-8 font-bold text-slate-900 hover:bg-slate-50 dark:border-white/30 dark:bg-transparent dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
                            >
                                {data.secondary_button}
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
