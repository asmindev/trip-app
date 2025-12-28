import { Separator } from '@/components/ui/separator';
import { Instagram, Mail, MapPin, Phone, Ship, Twitter } from 'lucide-react';

export function LandingFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative border-t border-border bg-card">
            <div className="container mx-auto px-6 py-16 lg:py-20">
                <div className="grid gap-12 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="flex items-center gap-3">
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400">
                                <Ship className="size-6 text-white" />
                            </div>
                            <div>
                                <div className="text-xl font-black">KAPAL TRIP</div>
                                <div className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Jelajahi Nusantara</div>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            Platform booking tiket kapal terpercaya di Indonesia. Melayani perjalanan ke pulau-pulau eksotis di Sulawesi.
                        </p>
                        <div className="flex gap-3">
                            {[Instagram, Twitter].map((Icon, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="flex size-10 items-center justify-center rounded-xl bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
                                >
                                    <Icon className="size-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 gap-8 lg:col-span-2">
                        <div className="space-y-4">
                            <h4 className="font-bold">Jelajahi</h4>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                {['Semua Rute', 'Jadwal Keberangkatan', 'Promo Spesial', 'Cara Pemesanan'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="transition-colors hover:text-foreground">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold">Perusahaan</h4>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                {['Tentang Kami', 'Karir', 'Syarat & Ketentuan', 'Kebijakan Privasi'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="transition-colors hover:text-foreground">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="font-bold">Hubungi Kami</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li className="flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                                    <Mail className="size-4" />
                                </div>
                                <span>info@kapaltrip.id</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                                    <Phone className="size-4" />
                                </div>
                                <span>+62 812-3456-7890</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                                    <MapPin className="size-4" />
                                </div>
                                <span>Kendari, Sulawesi Tenggara, Indonesia</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-10" />

                {/* Bottom */}
                <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
                    <p>© {currentYear} Kapal Trip. Hak Cipta Dilindungi.</p>
                    <div className="flex gap-6">
                        <a href="#" className="transition-colors hover:text-foreground">
                            Syarat Layanan
                        </a>
                        <a href="#" className="transition-colors hover:text-foreground">
                            Privasi
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
