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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LogOut, Menu, Ship, Ticket, User as UserIcon } from 'lucide-react';
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
                className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? 'border-b border-slate-200/50 bg-white/80 shadow-sm backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/80'
                        : 'border-b border-white/10 bg-slate-900/40 backdrop-blur-md'
                }`}
            >
                <nav className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex size-9 items-center justify-center overflow-hidden rounded-lg bg-primary p-1.5 shadow-lg shadow-orange-500/25">
                            {settings?.app_logo ? (
                                <img src={settings.app_logo} alt={appName} className="size-full object-contain brightness-0 invert" />
                            ) : (
                                <Ship className="size-5 text-white" />
                            )}
                        </div>
                        <span className={`text-xl font-bold transition-colors ${isScrolled ? 'text-slate-900 dark:text-white' : 'text-white'}`}>
                            {appName}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-8 md:flex">
                        {navLinks.map((link) => {
                            const isActive = route().current(link.route);
                            return (
                                <Link
                                    key={link.name}
                                    href={route(link.route)}
                                    className={`text-sm font-medium transition-colors ${
                                        isScrolled
                                            ? isActive
                                                ? 'text-primary'
                                                : 'text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary'
                                            : isActive
                                              ? 'text-orange-200'
                                              : 'text-white/90 hover:text-white'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />

                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="gap-2">
                                        <div className="flex size-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                                            <UserIcon className="size-4 text-primary" />
                                        </div>
                                        <span className="hidden md:inline">{auth.user.name}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/my-bookings">
                                            <Ticket className="mr-2 size-4" />
                                            Pesanan Saya
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile">
                                            <UserIcon className="mr-2 size-4" />
                                            Profil
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href={route('logout')} method="post" as="button" className="w-full">
                                            <LogOut className="mr-2 size-4" />
                                            Logout
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="hidden items-center gap-2 md:flex">
                                <Button variant="ghost" asChild>
                                    <Link href={route('login')}>Masuk</Link>
                                </Button>
                                <Button className="bg-primary hover:bg-primary/90" asChild>
                                    <Link href="/signup">Daftar</Link>
                                </Button>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="size-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[280px]">
                                <SheetHeader>
                                    <SheetTitle>Menu</SheetTitle>
                                </SheetHeader>
                                <div className="mt-6 flex flex-col gap-4">
                                    {navLinks.map((link) => {
                                        const isActive = route().current(link.route);
                                        return (
                                            <Link
                                                key={link.name}
                                                href={route(link.route)}
                                                className={`text-lg font-medium ${
                                                    isActive ? 'text-primary' : 'text-slate-700 hover:text-primary dark:text-slate-300'
                                                }`}
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {link.name}
                                            </Link>
                                        );
                                    })}
                                    <div className="my-4 h-px bg-slate-200 dark:bg-slate-700" />
                                    {!auth.user && (
                                        <>
                                            <Button variant="outline" asChild>
                                                <Link href={route('login')}>Masuk</Link>
                                            </Button>
                                            <Button className="bg-primary hover:bg-primary/90" asChild>
                                                <Link href="/signup">Daftar</Link>
                                            </Button>
                                        </>
                                    )}
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
                                <div className="flex size-9 items-center justify-center overflow-hidden rounded-lg bg-primary p-1.5">
                                    {settings?.app_logo ? (
                                        <img src={settings.app_logo} alt={appName} className="size-full object-contain brightness-0 invert" />
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
