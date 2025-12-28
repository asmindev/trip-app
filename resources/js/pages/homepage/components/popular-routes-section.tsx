import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, MapPin, Star } from 'lucide-react';

interface TripRoute {
    id: number;
    name: string;
    branch?: { name: string };
}

interface PopularRoutesSectionProps {
    routes?: TripRoute[];
}

const defaultRoutes = [
    { id: 1, name: 'Kendari - Labengki' },
    { id: 2, name: 'Palu - Togean' },
    { id: 3, name: 'Manado - Bunaken' },
];

const emojis = ['🏝️', '🌴', '🐠', '🐚', '🦑'];

export function PopularRoutesSection({ routes }: PopularRoutesSectionProps) {
    const data = routes && routes.length > 0 ? routes : defaultRoutes;

    return (
        <section id="destinasi" className="bg-muted/30 py-20 lg:py-28">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mb-12 text-center">
                    <Badge variant="outline" className="mb-4">
                        🚢 Rute Populer
                    </Badge>
                    <h2 className="text-3xl font-black md:text-4xl">
                        Destinasi <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Favorit</span>
                    </h2>
                </div>

                {/* Cards */}
                <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
                    {data.map((route, idx) => {
                        const [from, to] = route.name.split(' - ');
                        return (
                            <div
                                key={route.id}
                                className="group overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-xl"
                            >
                                {/* Emoji Header */}
                                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-400">
                                    <span className="text-5xl transition-transform group-hover:scale-110">{emojis[idx % emojis.length]}</span>
                                </div>

                                {/* Content */}
                                <div className="space-y-4 p-5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="size-4 text-blue-500" />
                                            <span className="font-semibold">{from || 'Origin'}</span>
                                            <ArrowRight className="size-3 text-muted-foreground" />
                                            <span className="font-semibold">{to || 'Destination'}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Star className="size-3 fill-yellow-400 text-yellow-400" />
                                            <span>4.9</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-border/50 pt-3">
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Clock className="size-4" />
                                            <span>3 Jam</span>
                                        </div>
                                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">Rp 150.000</div>
                                    </div>

                                    <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500">Pesan Sekarang</Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
