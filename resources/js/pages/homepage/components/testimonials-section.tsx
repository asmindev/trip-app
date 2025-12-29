import { Marquee } from '@/components/ui/marquee';
import { Star } from 'lucide-react';
import { motion } from 'motion/react';

interface Testimonial {
    name: string;
    text: string;
    avatar: string;
}

interface TestimonialsSectionProps {
    testimonials?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
    {
        name: 'Andi Saputra',
        text: 'Booking cepat dan mudah! Langsung dapat e-ticket, tidak perlu antri. Sangat praktis untuk perjalanan bisnis.',
        avatar: '👨‍💼',
    },
    { name: 'Siti Nurhaliza', text: 'Harga lebih murah dibanding beli langsung + dapat promo 20%! Aplikasinya juga user friendly. 🔥', avatar: '👩‍🦰' },
    {
        name: 'Budi Santoso',
        text: 'Customer service responsif banget. Waktu ada kendala, langsung dibantu dalam hitungan menit. Recommended!',
        avatar: '👨‍🔬',
    },
    {
        name: 'Dewi Lestari',
        text: 'Liburan keluarga jadi gampang diatur. Tinggal pilih tanggal, bayar, selesai. Terima kasih Kapal Trip!',
        avatar: '👩‍🎓',
    },
    {
        name: 'Rizky Maulana',
        text: 'Sudah 5x booking lewat Kapal Trip. Tidak pernah ada masalah. Armada kapalnya juga bagus dan nyaman.',
        avatar: '👨‍🎨',
    },
    { name: 'Putri Amanda', text: 'App-nya keren banget! Dark mode, notifikasi real-time, dan tracking kapal. Modern sekali!', avatar: '👩‍💻' },
];

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
    const data = testimonials || defaultTestimonials;

    return (
        <section className="overflow-hidden bg-slate-50 py-24 lg:py-32 dark:bg-slate-900/50">
            <div className="container mx-auto mb-12 px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
                    <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl dark:text-white">
                        Kata <span className="bg-linear-to-r from-cyan-600 to-teal-500 bg-clip-text text-transparent">Mereka</span>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">Ribuan traveler sudah mempercayakan perjalanannya kepada kami</p>
                </motion.div>
            </div>

            <Marquee pauseOnHover speed="slow">
                {data.map((t, idx) => (
                    <div
                        key={idx}
                        className="mx-3 w-[320px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-cyan-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-cyan-700"
                    >
                        {/* Stars */}
                        <div className="mb-4 flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                            ))}
                        </div>

                        {/* Quote */}
                        <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">"{t.text}"</p>

                        {/* Author */}
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">{t.avatar}</span>
                            <div>
                                <div className="font-semibold text-slate-900 dark:text-white">{t.name}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Verified Traveler</div>
                            </div>
                        </div>
                    </div>
                ))}
            </Marquee>
        </section>
    );
}
