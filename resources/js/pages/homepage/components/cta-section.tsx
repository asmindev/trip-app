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
            {/* Background */}
            <div className="absolute inset-0 bg-secondary" />

            {/* Mesh gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent" />

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-size-[32px_32px]" />

            {/* Floating decorations */}
            <div className="absolute top-10 left-10 size-20 animate-pulse rounded-full bg-white/10 blur-xl" />
            <div className="absolute right-10 bottom-10 size-32 animate-pulse rounded-full bg-white/10 blur-xl" style={{ animationDelay: '1s' }} />

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
                            <div className="absolute inset-0 animate-ping rounded-full bg-white/30" />
                            <div className="relative flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                                <Sparkles className="size-8 text-white" />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-white md:text-4xl lg:text-5xl">{data.headline}</h2>
                    <p className="mx-auto max-w-xl text-lg text-white/80">{data.subheadline}</p>

                    <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
                        <Link href={route('booking.index')}>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    size="lg"
                                    className="group h-14 bg-primary px-8 font-bold text-white shadow-xl shadow-orange-900/20 hover:bg-primary/90 hover:shadow-2xl"
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
                                className="h-14 border-2 border-white/30 bg-transparent px-8 font-bold text-white hover:bg-white/10 hover:text-white"
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
