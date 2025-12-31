import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, LogOut, Menu, Ship, Ticket, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

interface AppLayoutProps {
    children: ReactNode;
}

const navLinks = [
    { name: 'Beranda', route: 'home' },
    { name: 'Cari Tiket', route: 'booking.index' },
];

interface AppSettings {
    app_name?: string;
    app_logo?: string;
    app_description?: string;
    contact_email?: string;
    contact_whatsapp?: string;
    social_instagram?: string;
    social_facebook?: string;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const { props } = usePage();
    const auth = props.auth as { user: User | null };
    const flash = props.flash as { type: 'success' | 'error' | 'message' | null; content: string | null } | undefined;
    const settings = (props.app_settings as unknown as AppSettings) || {};
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const appName = settings?.app_name || 'Kapal Trip';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (flash?.content) {
            toast[flash.type ?? 'message'](flash.content);
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
            {/* Navbar */}
            <header
                className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 will-change-transform ${
                    isScrolled
                        ? 'border-b border-slate-200/60 bg-white/70 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/70'
                        : 'border-b border-transparent bg-transparent'
                }`}
            >
                <div className="absolute inset-0 -z-10 bg-linear-to-b from-slate-900/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <nav className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
                    {/* Logo Section */}
                    <Link href="/" className="group/logo relative flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative flex size-10 items-center justify-center overflow-hidden rounded-lg bg-primary p-0.5 shadow-lg shadow-orange-500/30 transition-shadow group-hover/logo:shadow-orange-500/40"
                        >
                            {settings?.app_logo ? (
                                <img src={settings.app_logo} alt={appName} className="size-full rounded-md object-contain" />
                            ) : (
                                <Ship className="size-6 text-white" />
                            )}
                            <div className="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent" />
                        </motion.div>
                        <div className="flex flex-col leading-tight">
                            <span
                                className={`text-xl font-black tracking-tight transition-colors duration-300 ${
                                    isScrolled ? 'text-slate-900 dark:text-white' : 'text-white'
                                }`}
                            >
                                {appName.split(' ')[0]}
                                <span
                                    className={`transition-colors duration-300 ${
                                        isScrolled ? 'text-primary' : 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]'
                                    }`}
                                >
                                    {appName.split(' ')[1] || ''}
                                </span>
                            </span>
                            <span
                                className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-opacity duration-300 ${
                                    isScrolled ? 'text-slate-500' : 'text-white/60'
                                }`}
                            >
                                Premium Travel
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center lg:flex">
                        <div className="flex items-center gap-1 rounded-full bg-slate-900/5 p-1 backdrop-blur-sm dark:bg-white/5">
                            {navLinks.map((link) => {
                                const isActive = route().current(link.route);
                                return (
                                    <Link
                                        key={link.name}
                                        href={route(link.route)}
                                        className={`relative px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                                            isActive
                                                ? isScrolled
                                                    ? 'text-primary'
                                                    : 'text-white'
                                                : isScrolled
                                                  ? 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                                  : 'text-white/80 hover:text-white'
                                        }`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeNav"
                                                className={`absolute inset-0 z-0 rounded-full shadow-sm ${
                                                    isScrolled ? 'bg-white dark:bg-slate-800' : 'bg-white/20 backdrop-blur-md'
                                                }`}
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10">{link.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        <div className="mr-2 hidden h-8 w-px bg-slate-200 lg:block dark:bg-slate-800" />
                        <ThemeToggle />

                        {auth.user ? (
                            <DropdownMenu theme="custom">
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className={`group relative h-11 gap-3 rounded-full border-2 border-transparent px-2 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 ${
                                            isScrolled ? 'text-slate-900 dark:text-white' : 'text-white'
                                        }`}
                                    >
                                        <div className="relative size-8 overflow-hidden rounded-full ring-2 ring-primary/20 transition-all group-hover:ring-primary/50">
                                            <div className="flex size-full items-center justify-center bg-orange-100 dark:bg-orange-900/50">
                                                <UserIcon className="size-4 text-primary" />
                                            </div>
                                        </div>
                                        <span className="hidden pr-2 text-sm font-bold md:inline">{auth.user.name}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 shadow-2xl">
                                    <div className="mb-2 px-3 py-3">
                                        <DropdownMenuLabel className="p-0 text-xs font-semibold tracking-widest text-slate-400 uppercase">
                                            Akun Pelanggan
                                        </DropdownMenuLabel>
                                        <div className="mt-2 flex items-center gap-3">
                                            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                                                <UserIcon className="size-5 text-primary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold">{auth.user.name}</span>
                                                <span className="text-xs text-slate-500">{auth.user.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator className="mx-2" />
                                    <div className="grid gap-1 py-1">
                                        <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 focus:bg-primary/10 focus:text-primary">
                                            <Link href="/my-bookings" className="flex items-center">
                                                <div className="mr-3 flex size-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                                                    <Ticket className="size-4" />
                                                </div>
                                                <span className="font-medium">Pesanan Saya</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 focus:bg-primary/10 focus:text-primary">
                                            <Link href="/profile" className="flex items-center">
                                                <div className="mr-3 flex size-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                                                    <UserIcon className="size-4" />
                                                </div>
                                                <span className="font-medium">Profil Lengkap</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </div>
                                    <DropdownMenuSeparator className="mx-2" />
                                    <DropdownMenuItem
                                        asChild
                                        className="rounded-xl px-3 py-2.5 text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950"
                                    >
                                        <Link href={route('logout')} method="post" as="button" className="flex w-full items-center">
                                            <div className="mr-3 flex size-8 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950">
                                                <LogOut className="size-4" />
                                            </div>
                                            <span className="font-bold tracking-wide uppercase">Keluar</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="hidden items-center gap-3 lg:flex">
                                <Button
                                    variant="ghost"
                                    asChild
                                    className={`font-bold transition-all ${isScrolled ? 'text-slate-600' : 'text-white hover:bg-white/10'}`}
                                >
                                    <Link href={route('login')}>Masuk</Link>
                                </Button>
                                <Button
                                    className="bg-primary px-6 font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-primary/90 hover:shadow-orange-500/30"
                                    asChild
                                >
                                    <Link href="/signup">Daftar Sekarang</Link>
                                </Button>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`lg:hidden ${isScrolled ? 'text-slate-900 dark:text-white' : 'text-white'}`}
                                >
                                    <Menu className="size-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-full border-l-0 p-0 sm:max-w-xs">
                                <div className="flex h-full flex-col bg-slate-50 dark:bg-slate-950">
                                    <div className="flex h-20 items-center border-b border-slate-200 px-6 dark:border-slate-800">
                                        <SheetTitle className="text-xl font-black text-primary italic">MENU</SheetTitle>
                                    </div>
                                    <div className="flex-1 overflow-y-auto px-6 py-8">
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">Navigasi Utama</p>
                                            <div className="grid gap-2">
                                                {navLinks.map((link) => {
                                                    const isActive = route().current(link.route);
                                                    return (
                                                        <Link
                                                            key={link.name}
                                                            href={route(link.route)}
                                                            className={`flex items-center rounded-2xl px-5 py-4 text-lg font-bold transition-all ${
                                                                isActive
                                                                    ? 'bg-primary text-white shadow-lg shadow-orange-500/20'
                                                                    : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300'
                                                            }`}
                                                            onClick={() => setMobileMenuOpen(false)}
                                                        >
                                                            {link.name}
                                                            <ArrowRight
                                                                className={`ml-auto size-5 transition-transform ${isActive ? 'translate-x-0' : '-translate-x-2 opacity-0'}`}
                                                            />
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="mt-12 space-y-4">
                                            {!auth.user && (
                                                <>
                                                    <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                                                        Mulai Perjalanan
                                                    </p>
                                                    <div className="grid gap-3">
                                                        <Button variant="outline" className="h-14 rounded-2xl border-2 font-bold" asChild>
                                                            <Link href={route('login')}>Masuk ke Akun</Link>
                                                        </Button>
                                                        <Button
                                                            className="h-14 rounded-2xl bg-primary font-black shadow-lg shadow-orange-500/20"
                                                            asChild
                                                        >
                                                            <Link href="/signup">Daftar Sekarang</Link>
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="border-t border-slate-200 p-6 dark:border-slate-800">
                                        <div className="flex items-center justify-between rounded-2xl bg-white p-4 dark:bg-slate-900">
                                            <span className="text-sm font-medium">Mode Tampilan</span>
                                            <ThemeToggle />
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <div className="container mx-auto px-4 py-12 lg:px-6">
                    <div className="grid gap-8 md:grid-cols-4">
                        {/* Brand */}
                        <div className="md:col-span-1">
                            <Link href="/" className="mb-4 flex items-center gap-2">
                                <div className="flex size-9 items-center justify-center overflow-hidden rounded-lg bg-primary p-0.5">
                                    {settings?.app_logo ? (
                                        <img src={settings.app_logo} alt={appName} className="size-full rounded-md object-contain" />
                                    ) : (
                                        <Ship className="size-5 text-white" />
                                    )}
                                </div>
                                <span className="text-xl font-bold text-slate-900 dark:text-white">{appName}</span>
                            </Link>
                            <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
                                {settings?.app_description ||
                                    'Platform booking tiket kapal terpercaya #1 di Indonesia. Jelajahi keindahan Nusantara dengan aman dan nyaman.'}
                            </p>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Hubungi Kami</h4>
                            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                                <li className="flex items-center gap-2">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Email:</span>
                                    {settings?.contact_email || 'info@kapaltrip.id'}
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">WA:</span>+
                                    {settings?.contact_whatsapp || '6281234567890'}
                                </li>
                                <li className="mt-4 flex gap-4">
                                    {settings?.social_instagram && (
                                        <a href={settings.social_instagram} className="text-slate-400 transition-colors hover:text-primary">
                                            Instagram
                                        </a>
                                    )}
                                    {settings?.social_facebook && (
                                        <a href={settings.social_facebook} className="text-slate-400 transition-colors hover:text-primary">
                                            Facebook
                                        </a>
                                    )}
                                </li>
                            </ul>
                        </div>

                        {/* Links */}
                        <div>
                            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Perusahaan</h4>
                            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                                <li>
                                    <Link href="/#about" className="hover:text-primary">
                                        Tentang Kami
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/careers" className="hover:text-primary">
                                        Karir
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="hover:text-primary">
                                        Kontak
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Bantuan</h4>
                            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                                <li>
                                    <Link href="/faq" className="hover:text-primary">
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="hover:text-primary">
                                        Syarat & Ketentuan
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy" className="hover:text-primary">
                                        Kebijakan Privasi
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-slate-200 pt-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                        © {new Date().getFullYear()} {appName}. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
