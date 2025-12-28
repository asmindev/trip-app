import { Marquee } from '@/components/ui/marquee';
import { Star } from 'lucide-react';

interface Testimonial {
    name: string;
    text: string;
    avatar: string;
}

interface TestimonialsSectionProps {
    testimonials?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
    { name: 'Andi S.', text: 'Booking cepat, langsung dapat e-ticket. Praktis!', avatar: '👨‍💼' },
    { name: 'Siti N.', text: 'Harga lebih murah + dapat promo 20%! 🔥', avatar: '👩‍🦰' },
    { name: 'Budi S.', text: 'Customer service responsif banget. Recommended!', avatar: '👨‍🔬' },
    { name: 'Dewi L.', text: 'Liburan jadi gampang. Tinggal pilih, bayar, selesai.', avatar: '👩‍🎓' },
    { name: 'Rizky M.', text: 'Sudah 5x booking. Tidak pernah ada masalah.', avatar: '👨‍🎨' },
    { name: 'Putri A.', text: 'App-nya user friendly. Dark mode keren!', avatar: '👩‍💻' },
];

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
    const data = testimonials || defaultTestimonials;

    return (
        <section className="overflow-hidden py-20 lg:py-28">
            <div className="container mx-auto mb-10 px-6">
                <div className="text-center">
                    <h2 className="mb-2 text-3xl font-black md:text-4xl">
                        Kata <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Mereka</span>
                    </h2>
                    <p className="text-muted-foreground">Ribuan traveler sudah mempercayakan perjalanannya</p>
                </div>
            </div>

            <Marquee pauseOnHover speed="slow">
                {data.map((t, idx) => (
                    <div
                        key={idx}
                        className="mx-2 w-[280px] rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur transition-all hover:bg-card"
                    >
                        <div className="mb-3 flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="size-3 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <p className="mb-4 text-sm">{t.text}</p>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{t.avatar}</span>
                            <span className="text-sm font-semibold">{t.name}</span>
                        </div>
                    </div>
                ))}
            </Marquee>
        </section>
    );
}
