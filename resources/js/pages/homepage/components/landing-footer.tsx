import { Separator } from '@/components/ui/separator';
import { Link, usePage } from '@inertiajs/react';
import { Facebook, Heart, Instagram, Mail, MapPin, Phone, Ship } from 'lucide-react';
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

interface FooterSettings {
    app_name?: string;
    app_logo?: string;
    app_description?: string;
    social_instagram?: string;
    social_facebook?: string;
    contact_email?: string;
    contact_whatsapp?: string;
}

export function LandingFooter() {
    const { props } = usePage();
    const settings = (props.app_settings as FooterSettings) || {};
    const appName = settings.app_name || 'Kapal Trip';
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-200 bg-orange-50/30 hover:border-orange-100 dark:border-slate-800 dark:bg-slate-900">
            <div className="container mx-auto px-6 py-16 lg:py-20">
                <div className="grid gap-12 lg:grid-cols-6">
                    {/* Brand Column */}
                    <div className="space-y-6 lg:col-span-2">
                        <Link href={route('home')} className="inline-flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-orange-500 shadow-lg shadow-cyan-500/25">
                                {settings.app_logo ? (
                                    <img src={settings.app_logo} alt={appName} className="size-6 object-contain brightness-0 invert" />
                                ) : (
                                    <Ship className="size-5 text-white" />
                                )}
                            </div>
                            <div>
                                <div className="text-xl font-bold text-slate-900 dark:text-white">{appName}</div>
                            </div>
                        </Link>
                        <p className="max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            {settings.app_description ||
                                'Platform booking tiket kapal terpercaya di Indonesia. Melayani perjalanan ke pulau-pulau eksotis di Sulawesi.'}
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-2">
                            {settings.social_instagram && (
                                <a
                                    href={settings.social_instagram}
                                    aria-label="Instagram"
                                    className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-cyan-500/25 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-primary dark:hover:text-white"
                                >
                                    <Instagram className="size-4" />
                                </a>
                            )}
                            {settings.social_facebook && (
                                <a
                                    href={settings.social_facebook}
                                    aria-label="Facebook"
                                    className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-cyan-500/25 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-primary dark:hover:text-white"
                                >
                                    <Facebook className="size-4" />
                                </a>
                            )}
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
                                        className="text-sm text-slate-600 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary"
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
                                        className="text-sm text-slate-600 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary"
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
                                        className="text-sm text-slate-600 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary"
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
                                <span className="text-sm text-slate-600 dark:text-slate-400">{settings.contact_email || 'info@kapaltrip.id'}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                                    <Phone className="size-4 text-slate-600 dark:text-slate-400" />
                                </div>
                                <span className="text-sm text-slate-600 dark:text-slate-400">+{settings.contact_whatsapp || '62 812-3456-7890'}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                                    <MapPin className="size-4 text-slate-600 dark:text-slate-400" />
                                </div>
                                <span className="text-sm text-slate-600 dark:text-slate-400">Pusat Layanan Pelanggan</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-10" />

                {/* Bottom */}
                <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-600 md:flex-row dark:text-slate-400">
                    <p>
                        © {currentYear} {appName}. Hak Cipta Dilindungi.
                    </p>
                    <div className="flex items-center gap-1">
                        Made with <Heart className="mx-1 size-4 fill-red-500 text-red-500" /> in Indonesia
                    </div>
                </div>
            </div>
        </footer>
    );
}
