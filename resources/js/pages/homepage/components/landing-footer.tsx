import { Separator } from '@/components/ui/separator';
import { Link } from '@inertiajs/react';
import { Facebook, Heart, Instagram, Mail, MapPin, Phone, Ship, Twitter, Youtube } from 'lucide-react';
import { route } from 'ziggy-js';

const footerLinks = {
    explore: [
        { name: 'Semua Rute', href: '#' },
        { name: 'Jadwal Keberangkatan', href: '#' },
        { name: 'Promo Spesial', href: '#' },
        { name: 'Cara Pemesanan', href: '#' },
    ],
    company: [
        { name: 'Tentang Kami', href: '#' },
        { name: 'Karir', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Partner', href: '#' },
    ],
    support: [
        { name: 'Pusat Bantuan', href: '#' },
        { name: 'Syarat & Ketentuan', href: '#' },
        { name: 'Kebijakan Privasi', href: '#' },
        { name: 'FAQ', href: '#' },
    ],
};

const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
];

export function LandingFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
            <div className="container mx-auto px-6 py-16 lg:py-20">
                <div className="grid gap-12 lg:grid-cols-6">
                    {/* Brand Column */}
                    <div className="space-y-6 lg:col-span-2">
                        <Link href={route('home')} className="inline-flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-linear-to-br from-cyan-500 to-teal-500 shadow-lg shadow-cyan-500/25">
                                <Ship className="size-5 text-white" />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-slate-900 dark:text-white">Kapal Trip</div>
                            </div>
                        </Link>
                        <p className="max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            Platform booking tiket kapal terpercaya di Indonesia. Melayani perjalanan ke pulau-pulau eksotis di Sulawesi dengan armada
                            modern dan pelayanan premium.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-2">
                            {socialLinks.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all hover:bg-cyan-500 hover:text-white hover:shadow-lg hover:shadow-cyan-500/25 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-cyan-500 dark:hover:text-white"
                                >
                                    <Icon className="size-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Explore Links */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 dark:text-white">Jelajahi</h4>
                        <ul className="space-y-3">
                            {footerLinks.explore.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-slate-600 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 dark:text-white">Perusahaan</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-slate-600 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 dark:text-white">Dukungan</h4>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-slate-600 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 dark:text-white">Hubungi Kami</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                                    <Mail className="size-4 text-slate-600 dark:text-slate-400" />
                                </div>
                                <span className="text-sm text-slate-600 dark:text-slate-400">info@kapaltrip.id</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                                    <Phone className="size-4 text-slate-600 dark:text-slate-400" />
                                </div>
                                <span className="text-sm text-slate-600 dark:text-slate-400">+62 812-3456-7890</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                                    <MapPin className="size-4 text-slate-600 dark:text-slate-400" />
                                </div>
                                <span className="text-sm text-slate-600 dark:text-slate-400">Kendari, Sulawesi Tenggara</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-10" />

                {/* Bottom */}
                <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-600 md:flex-row dark:text-slate-400">
                    <p>© {currentYear} Kapal Trip. Hak Cipta Dilindungi.</p>
                    <div className="flex items-center gap-1">
                        Made with <Heart className="mx-1 size-4 fill-red-500 text-red-500" /> in Indonesia
                    </div>
                </div>
            </div>
        </footer>
    );
}
