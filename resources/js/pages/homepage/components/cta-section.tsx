import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
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
    subheadline: 'Pesan tiketmu sekarang dan nikmati keindahan alam Sulawesi',
    primary_button: 'Pesan Tiket',
    secondary_button: 'Hubungi Kami',
};

export function CTASection({ settings }: CTASectionProps) {
    const data = settings || defaultSettings;

    return (
        <section className="relative overflow-hidden py-20 lg:py-28">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />

            <div className="relative container mx-auto px-6 text-center">
                <div className="mx-auto max-w-2xl space-y-6">
                    <h2 className="text-3xl font-black text-white md:text-4xl lg:text-5xl">{data.headline}</h2>
                    <p className="text-lg text-white/80">{data.subheadline}</p>
                    <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
                        <Link href={route('booking.index')}>
                            <Button size="lg" className="group h-12 bg-white px-8 font-bold text-blue-600 hover:bg-white/90">
                                {data.primary_button}
                                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-12 border-white/40 bg-transparent px-8 font-bold text-white hover:bg-white/10"
                        >
                            {data.secondary_button}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
