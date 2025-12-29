import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { Menu, Ship, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

const navLinks = [
    { name: 'Beranda', href: '#' },
    { name: 'Rute', href: '#destinasi' },
    { name: 'Jadwal', href: '#jadwal' },
    { name: 'Cek Pesanan', href: '#' },
];

interface NavbarSettings {
    app_name?: string;
    app_logo?: string;
}

export function LandingNavbar() {
    const { props } = usePage();
    const settings = (props.app_settings as NavbarSettings) || {};
    const appName = settings.app_name || 'Kapal Trip';
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={cn(
                'fixed top-0 z-50 w-full transition-all duration-500',
                isScrolled
                    ? 'border-b border-white/10 bg-white/80 py-3 shadow-lg shadow-slate-900/5 backdrop-blur-xl dark:bg-slate-900/80'
                    : 'bg-transparent py-5',
            )}
        >
            <div className="container mx-auto flex items-center justify-between px-6">
                {/* Logo */}
                <Link href={route('home')} className="group flex items-center gap-3">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 3 }}
                        className="relative flex size-11 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-orange-500 shadow-lg shadow-cyan-500/25"
                    >
                        {settings.app_logo ? (
                            <img src={settings.app_logo} alt={appName} className="size-6 object-contain brightness-0 invert" />
                        ) : (
                            <Ship className="size-5 text-white" />
                        )}
                    </motion.div>
                    <div className="flex flex-col">
                        <span
                            className={cn(
                                'text-xl font-bold tracking-tight transition-colors',
                                isScrolled ? 'text-slate-900 dark:text-white' : 'text-white',
                            )}
                        >
                            {appName}
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-1 lg:flex">
                    {navLinks.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'group relative px-4 py-2 text-sm font-medium transition-colors',
                                isScrolled
                                    ? 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                                    : 'text-white/80 hover:text-white',
                            )}
                        >
                            {item.name}
                            <span className="absolute inset-x-4 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-linear-to-r from-blue-500 to-orange-500 transition-transform group-hover:scale-x-100" />
                        </a>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <div className={cn(isScrolled ? '' : '[&_button]:text-white')}>
                        <ThemeToggle />
                    </div>

                    <Link href={route('login')} className="hidden lg:inline-block">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                'font-semibold',
                                isScrolled
                                    ? 'text-slate-700 hover:text-slate-900 dark:text-slate-300'
                                    : 'text-white hover:bg-white/10 hover:text-white',
                            )}
                        >
                            Masuk
                        </Button>
                    </Link>

                    <Link href={route('register')}>
                        <Button
                            size="sm"
                            className="rounded-full bg-primary px-5 font-semibold shadow-lg shadow-cyan-600/25 transition-all hover:scale-105 hover:bg-primary/700 hover:shadow-xl hover:shadow-orange-500/10"
                        >
                            Daftar
                        </Button>
                    </Link>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn('lg:hidden', !isScrolled && 'text-white hover:bg-white/10')}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-xl lg:hidden dark:border-slate-700/50 dark:bg-slate-900/95"
                    >
                        <nav className="container mx-auto flex flex-col gap-1 px-6 py-4">
                            {navLinks.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="rounded-lg px-4 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </a>
                            ))}
                            <div className="mt-4 border-t border-slate-200 pt-4 hover:border-orange-100 dark:border-slate-700">
                                <Link href={route('login')}>
                                    <Button variant="outline" className="w-full">
                                        Masuk
                                    </Button>
                                </Link>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
