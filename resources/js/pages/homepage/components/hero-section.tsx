import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Marquee } from '@/components/ui/marquee';
import { Link } from '@inertiajs/react';
import { ArrowRight, MapPin, Play, Sparkles, Star } from 'lucide-react';
import { route } from 'ziggy-js';

interface HeroSettings {
    badge: string;
    headline: string;
    subheadline: string;
    stats: Array<{ value: string; label: string }>;
}

interface HeroSectionProps {
    settings?: HeroSettings;
}

const defaultSettings: HeroSettings = {
    badge: '100+ jadwal tersedia hari ini',
    headline: 'Jelajahi Surga Tersembunyi Indonesia',
    subheadline: 'Pesan tiket kapal ke pulau-pulau eksotis Indonesia dengan mudah. Cepat, aman, dan terpercaya.',
    stats: [
        { value: '50K+', label: 'Penumpang Puas' },
        { value: '4.9', label: 'Rating Pengguna' },
        { value: '15+', label: 'Rute Tersedia' },
    ],
};

const destinations = [
    { name: 'Labengki', img: '🏝️' },
    { name: 'Togean', img: '🌴' },
    { name: 'Bunaken', img: '🐠' },
    { name: 'Wakatobi', img: '🐚' },
    { name: 'Raja Ampat', img: '🦑' },
];

export function HeroSection({ settings }: HeroSectionProps) {
    const data = settings || defaultSettings;
    const [firstWord, ...rest] = data.headline.split(' ');

    return (
        <section className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-24 pb-12">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Gradient Orbs */}
            <div className="absolute top-1/4 -left-32 size-96 animate-pulse rounded-full bg-blue-500/30 blur-[128px]" />
            <div
                className="absolute -right-32 bottom-1/4 size-96 animate-pulse rounded-full bg-cyan-500/30 blur-[128px]"
                style={{ animationDelay: '1s' }}
            />

            <div className="relative container mx-auto px-6">
                <div className="mx-auto max-w-5xl text-center">
                    {/* Live Badge */}
                    <div className="mb-8 inline-flex items-center gap-2">
                        <Badge variant="outline" className="rounded-full border-border/50 bg-background/50 px-4 py-2 backdrop-blur">
                            <span className="relative mr-2 flex size-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex size-2 rounded-full bg-green-500" />
                            </span>
                            <span className="text-xs font-medium">{data.badge}</span>
                            <Sparkles className="ml-2 size-3 text-yellow-500" />
                        </Badge>
                    </div>

                    {/* Main Headline */}
                    <h1 className="mb-6 text-5xl leading-[1.1] font-black tracking-tight md:text-7xl lg:text-8xl">
                        <span className="block">{firstWord}</span>
                        <span className="relative mt-2 inline-block">
                            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
                                {rest.join(' ')}
                            </span>
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">{data.subheadline}</p>

                    {/* CTA Buttons */}
                    <div className="mb-16 flex flex-col justify-center gap-4 sm:flex-row">
                        <Link href={route('booking.index')}>
                            <Button
                                size="lg"
                                className="group relative h-14 overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 px-8 text-base font-semibold transition-all hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Mulai Petualangan
                                    <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                                </span>
                            </Button>
                        </Link>
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-14 border-2 px-8 text-base font-semibold backdrop-blur hover:bg-background/50"
                        >
                            <Play className="mr-2 size-5 fill-current" />
                            Tonton Video
                        </Button>
                    </div>

                    {/* Stats Row */}
                    <div className="mx-auto mb-16 grid max-w-2xl grid-cols-3 gap-6">
                        {data.stats.map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-3xl font-black md:text-4xl">
                                    {stat.value}
                                    {stat.label === 'Rating Pengguna' && <Star className="ml-1 inline size-4 fill-yellow-400 text-yellow-400" />}
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Destination Marquee */}
            <div className="relative mt-auto">
                <Marquee pauseOnHover speed="slow" className="py-4">
                    {destinations.map((dest, idx) => (
                        <div
                            key={idx}
                            className="group mx-2 flex cursor-pointer items-center gap-3 rounded-2xl border border-border/50 bg-card/50 px-6 py-4 backdrop-blur transition-all hover:border-primary/50 hover:bg-card"
                        >
                            <span className="text-3xl">{dest.img}</span>
                            <div className="flex flex-col">
                                <span className="font-semibold">{dest.name}</span>
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <MapPin className="size-3" /> Sulawesi
                                </span>
                            </div>
                            <ArrowRight className="size-4 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        </div>
                    ))}
                </Marquee>
            </div>
        </section>
    );
}
