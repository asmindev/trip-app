import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, MapPin, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface TripRoute {
    id: number;
    name: string;
    branch?: { name: string };
}

interface PopularRoutesSectionProps {
    routes?: TripRoute[];
}

const defaultRoutes = [
    { id: 1, name: 'Kendari - Labengki', image: '🏝️', duration: '3 Jam', price: 'Rp 150.000', rating: 4.9, color: 'from-cyan-400 to-blue-500' },
    { id: 2, name: 'Palu - Togean', image: '🌴', duration: '4 Jam', price: 'Rp 200.000', rating: 4.8, color: 'from-teal-400 to-cyan-500' },
    { id: 3, name: 'Manado - Bunaken', image: '🐠', duration: '2 Jam', price: 'Rp 120.000', rating: 4.9, color: 'from-blue-400 to-indigo-500' },
    { id: 4, name: 'Kendari - Wakatobi', image: '🐚', duration: '5 Jam', price: 'Rp 300.000', rating: 5.0, color: 'from-purple-400 to-pink-500' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
};

export function PopularRoutesSection({ routes }: PopularRoutesSectionProps) {
    const data =
        routes && routes.length > 0
            ? routes.map((r, i) => ({
                  ...r,
                  image: defaultRoutes[i % defaultRoutes.length].image,
                  duration: defaultRoutes[i % defaultRoutes.length].duration,
                  price: defaultRoutes[i % defaultRoutes.length].price,
                  rating: defaultRoutes[i % defaultRoutes.length].rating,
                  color: defaultRoutes[i % defaultRoutes.length].color,
              }))
            : defaultRoutes;

    return (
        <section id="destinasi" className="py-24 lg:py-32">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <Badge variant="outline" className="mb-4">
                            🚢 Rute Populer
                        </Badge>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mb-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl lg:text-5xl dark:text-white"
                    >
                        Destinasi <span className="bg-linear-to-r from-cyan-600 to-teal-500 bg-clip-text text-transparent">Favorit</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400"
                    >
                        Jelajahi keindahan pulau-pulau eksotis di Sulawesi
                    </motion.p>
                </div>

                {/* Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {data.map((route, idx) => {
                        const [from, to] = route.name.split(' - ');
                        const gradientColor = (route as any).color || defaultRoutes[idx % defaultRoutes.length].color;

                        return (
                            <motion.div
                                key={route.id}
                                variants={itemVariants}
                                whileHover={{ y: -8 }}
                                className="group relative overflow-hidden rounded-3xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl dark:bg-slate-800"
                            >
                                {/* Image/Gradient Header */}
                                <div className={`relative flex h-48 items-center justify-center bg-linear-to-br ${gradientColor}`}>
                                    <span className="text-7xl transition-transform duration-500 group-hover:scale-125">{(route as any).image}</span>

                                    {/* Rating Badge */}
                                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold backdrop-blur-sm">
                                        <Star className="size-3 fill-amber-400 text-amber-400" />
                                        <span>{(route as any).rating}</span>
                                    </div>

                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                        <Button className="bg-white font-semibold text-slate-900 hover:bg-white/90">
                                            Book Now
                                            <ArrowRight className="ml-2 size-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="mb-3 flex items-center gap-2 text-sm">
                                        <MapPin className="size-4 text-cyan-600" />
                                        <span className="font-semibold text-slate-900 dark:text-white">{from}</span>
                                        <ArrowRight className="size-3 text-slate-400" />
                                        <span className="font-semibold text-slate-900 dark:text-white">{to}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                                            <Clock className="size-4" />
                                            <span>{(route as any).duration}</span>
                                        </div>
                                        <div className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{(route as any).price}</div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <Button variant="outline" size="lg" className="group rounded-full px-8">
                        Lihat Semua Rute
                        <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
