import { Badge } from '@/components/ui/badge';
import { CreditCard, Headphones, Map, QrCode, Shield, Ship, Zap, type LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface Feature {
    icon: string;
    title: string;
    description: string;
}

interface FeaturesSectionProps {
    features?: Feature[];
}

const iconMap: Record<string, LucideIcon> = {
    Zap,
    Shield,
    CreditCard,
    Headphones,
    QrCode,
    Map,
    Ship,
};

const defaultFeatures: (Feature & { span?: number; visual?: 'qr' | 'map' | 'seat' | 'wallet' })[] = [
    {
        icon: 'QrCode',
        title: 'Digital Boarding Pass',
        description: 'Tidak perlu cetak tiket. Cukup tunjukkan QR code dari handphone Anda saat boarding.',
        span: 2,
        visual: 'qr',
    },
    {
        icon: 'Shield',
        title: 'Jaminan Uang Kembali',
        description: 'Refund 100% jika pembatalan oleh operator.',
        span: 1,
        visual: 'wallet',
    },
    {
        icon: 'Ship',
        title: 'Armada Premium',
        description: 'Kapal modern dengan fasilitas VIP terbaik.',
        span: 1,
        visual: 'seat',
    },
    {
        icon: 'Map',
        title: 'Real-time Tracking',
        description: 'Pantau posisi kapal secara langsung melalui GPS tracking di aplikasi kami.',
        span: 2,
        visual: 'map',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export function FeaturesSection({ features }: FeaturesSectionProps) {
    const data = features
        ? features.map((f, i) => ({
              ...f,
              span: defaultFeatures[i]?.span || 1,
              visual: defaultFeatures[i]?.visual,
          }))
        : defaultFeatures;

    return (
        <section id="fitur" className="bg-slate-50 py-24 lg:py-32 dark:bg-slate-900/50">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <Badge variant="outline" className="mb-4 bg-white dark:bg-slate-800">
                            ✨ Keunggulan Kami
                        </Badge>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mb-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl lg:text-5xl dark:text-white"
                    >
                        Mengapa Memilih <span className="bg-linear-to-r from-cyan-600 to-teal-500 bg-clip-text text-transparent">Kami?</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400"
                    >
                        Pengalaman booking tiket kapal yang modern, cepat, dan terpercaya
                    </motion.p>
                </div>

                {/* Bento Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6"
                >
                    {data.map((feature, idx) => {
                        const Icon = iconMap[feature.icon] || Zap;
                        const isLarge = feature.span === 2;

                        return (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-500/10 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-cyan-700 ${
                                    isLarge ? 'md:col-span-2' : ''
                                }`}
                            >
                                {/* Background decoration */}
                                <div className="absolute -top-12 -right-12 size-32 rounded-full bg-linear-to-br from-cyan-500/10 to-teal-500/10 transition-transform duration-500 group-hover:scale-150" />

                                <div className={`relative ${isLarge ? 'md:flex md:items-center md:gap-6' : ''}`}>
                                    {/* Visual Area (for large cards) */}
                                    {isLarge && feature.visual && (
                                        <div className="mb-4 flex h-32 w-full items-center justify-center rounded-2xl bg-linear-to-br from-slate-100 to-slate-50 md:mb-0 md:h-40 md:w-48 md:shrink-0 dark:from-slate-700 dark:to-slate-800">
                                            {feature.visual === 'qr' && (
                                                <div className="grid grid-cols-4 gap-1">
                                                    {[...Array(16)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`size-4 rounded-sm ${
                                                                Math.random() > 0.3 ? 'bg-slate-800 dark:bg-white' : 'bg-transparent'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            {feature.visual === 'map' && (
                                                <div className="relative size-full overflow-hidden rounded-2xl bg-linear-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30">
                                                    <div className="absolute top-1/3 left-1/4 size-3 animate-pulse rounded-full bg-cyan-500" />
                                                    <div className="absolute top-1/2 left-1/2 size-2 rounded-full bg-cyan-400" />
                                                    <div
                                                        className="absolute right-1/4 bottom-1/3 size-3 animate-pulse rounded-full bg-teal-500"
                                                        style={{ animationDelay: '0.5s' }}
                                                    />
                                                    <svg className="absolute inset-0 size-full opacity-20" viewBox="0 0 100 100">
                                                        <path
                                                            d="M25 33 L50 50 L75 66"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            fill="none"
                                                            strokeDasharray="4"
                                                            className="text-cyan-600"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex-1">
                                        {/* Icon */}
                                        <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/25 transition-transform duration-300 group-hover:scale-110">
                                            <Icon className="size-5" />
                                        </div>

                                        {/* Text */}
                                        <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{feature.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
