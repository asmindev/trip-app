import { CreditCard, Headphones, Shield, Zap, type LucideIcon } from 'lucide-react';

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
};

const defaultFeatures: Feature[] = [
    { icon: 'Zap', title: 'Booking Instan', description: 'Pesan tiket dalam hitungan detik' },
    { icon: 'Shield', title: 'Jaminan Aman', description: 'Pembayaran terenkripsi 100%' },
    { icon: 'CreditCard', title: 'Bayar Mudah', description: 'QRIS, E-wallet, Transfer Bank' },
    { icon: 'Headphones', title: 'Support 24/7', description: 'Tim siap membantu kapanpun' },
];

export function FeaturesSection({ features }: FeaturesSectionProps) {
    const data = features || defaultFeatures;

    return (
        <section id="fitur" className="py-20 lg:py-28">
            <div className="container mx-auto px-6">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {data.map((feature, idx) => {
                        const Icon = iconMap[feature.icon] || Zap;
                        return (
                            <div
                                key={idx}
                                className="group rounded-2xl border border-border/50 bg-card/50 p-6 text-center backdrop-blur transition-all hover:border-primary/30 hover:bg-card"
                            >
                                <div className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white transition-transform group-hover:scale-110">
                                    <Icon className="size-6" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
