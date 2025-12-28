import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Menu, Ship, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export function LandingNavbar() {
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
                isScrolled ? 'border-b border-border/50 bg-background/80 py-3 backdrop-blur-xl' : 'bg-transparent py-6',
            )}
        >
            <div className="container mx-auto flex items-center justify-between px-6">
                {/* Logo */}
                <Link href={route('home')} className="group flex items-center gap-3">
                    <div className="relative flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 transition-transform group-hover:scale-110 group-hover:rotate-3">
                        <Ship className="size-6 text-white" />
                        <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tight">KAPAL TRIP</span>
                        <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Jelajahi Nusantara</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-1 lg:flex">
                    {['Destinasi', 'Jadwal', 'Promo', 'Tentang'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="group relative px-5 py-2 text-sm font-medium transition-colors hover:text-primary"
                        >
                            {item}
                            <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-cyan-500 transition-all group-hover:left-0 group-hover:w-full" />
                        </a>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <Link href={route('login')} className="hidden lg:inline-block">
                        <Button variant="ghost" size="sm" className="font-semibold">
                            Masuk
                        </Button>
                    </Link>
                    <Link href={route('booking.index')}>
                        <Button
                            size="sm"
                            className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 font-semibold transition-all hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25"
                        >
                            <span className="relative z-10">Pesan Sekarang</span>
                        </Button>
                    </Link>

                    {/* Mobile Menu Button */}
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={cn(
                    'fixed inset-x-0 top-[72px] border-b border-border bg-background/95 backdrop-blur-xl transition-all duration-300 lg:hidden',
                    isOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0',
                )}
            >
                <nav className="container mx-auto flex flex-col gap-2 px-6 py-6">
                    {['Destinasi', 'Jadwal', 'Promo', 'Tentang'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="py-3 text-lg font-medium transition-colors hover:text-primary"
                            onClick={() => setIsOpen(false)}
                        >
                            {item}
                        </a>
                    ))}
                    <Link href={route('login')} className="mt-4">
                        <Button variant="outline" className="w-full">
                            Masuk
                        </Button>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
