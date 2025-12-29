import { Marquee } from '@/components/ui/marquee';

const operators = [
    { name: 'Pelni', logo: '🚢' },
    { name: 'ASDP', logo: '⛴️' },
    { name: 'Dharma Lautan', logo: '🛳️' },
    { name: 'Express Bahari', logo: '🚤' },
    { name: 'Sindo Ferry', logo: '⚓' },
    { name: 'Blue Sea Jet', logo: '🌊' },
];

export function SocialProofSection() {
    return (
        <section className="relative bg-slate-50 py-16 dark:bg-slate-900/50">
            {/* Spacer for floating widget - only on desktop where widget floats */}
            <div className="hidden md:block md:h-24 lg:h-28" />

            <div className="container mx-auto px-6">
                <p className="mb-8 text-center text-sm font-medium tracking-widest text-slate-500 uppercase dark:text-slate-400">
                    Dipercaya oleh operator terbaik di Indonesia
                </p>
            </div>

            <Marquee pauseOnHover speed="slow" className="py-2">
                {operators.map((operator, idx) => (
                    <div
                        key={idx}
                        className="mx-6 flex cursor-pointer items-center gap-3 opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                    >
                        <span className="text-4xl">{operator.logo}</span>
                        <span className="text-lg font-semibold text-slate-600 dark:text-slate-400">{operator.name}</span>
                    </div>
                ))}
            </Marquee>
        </section>
    );
}
