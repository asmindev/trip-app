import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { CTASection } from './components/cta-section';
import { FeaturesSection } from './components/features-section';
import { HeroSection } from './components/hero-section';
import { PopularRoutesSection } from './components/popular-routes-section';
import { TestimonialsSection } from './components/testimonials-section';

interface AppSettings {
    app_name?: string;
    hero_badge?: string;
    hero_title?: string;
    hero_subtitle?: string;
    hero_stats?: Array<{ value: string; label: string }>;
    landing_features?: Array<{ icon: string; title: string; description: string; span?: number; visual?: boolean }>;
    landing_testimonials?: Array<{ name: string; text: string; avatar: string }>;
    landing_cta?: {
        headline: string;
        subheadline: string;
        primary_button: string;
        secondary_button: string;
    };
    hero_image?: string;
    hero_cta_text?: string;
}

export interface TripRoute {
    id: number;
    name: string;
    branch?: { name: string };
}

interface WelcomeProps {
    routes?: TripRoute[];
}

export default function Welcome({ routes = [] }: WelcomeProps) {
    const { props } = usePage();
    const app_settings = (props.app_settings as unknown as AppSettings) || {};
    const appName = app_settings.app_name || 'Kapal Trip';

    // Helper functions as requested
    const getSetting = <T,>(key: keyof AppSettings, defaultValue: T): T => {
        return (app_settings[key] as T) || defaultValue;
    };

    const getImage = (key: keyof AppSettings): string | undefined => {
        const value = app_settings[key];
        if (!value || typeof value !== 'string') return undefined;
        return value;
    };

    const heroSettings = {
        badge: getSetting('hero_badge', '100+ jadwal tersedia hari ini'),
        headline: getSetting('hero_title', 'Jelajahi Nusantara Tanpa Batas'),
        subheadline: getSetting('hero_subtitle', 'Pesan tiket kapal ke pulau-pulau eksotis Indonesia dengan mudah.'),
        stats: getSetting('hero_stats', []),
        image: getImage('hero_image'),
        cta_text: getSetting('hero_cta_text', 'Cari Jadwal'),
    };

    return (
        <AppLayout>
            <Head title={`${appName} - Jelajahi Nusantara Tanpa Batas`} />

            <HeroSection settings={heroSettings} />
            <FeaturesSection features={getSetting('landing_features', [])} />
            <PopularRoutesSection routes={routes} />
            <TestimonialsSection testimonials={getSetting('landing_testimonials', [])} />
            <CTASection settings={getSetting('landing_cta', undefined)} />

            <style>{`
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to { transform: translateX(calc(-100% - var(--gap))); }
                }
                .animate-marquee { animation: marquee linear infinite; }
            `}</style>
        </AppLayout>
    );
}
