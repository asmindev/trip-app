import { Head } from '@inertiajs/react';
import { CTASection } from './components/cta-section';
import { FeaturesSection } from './components/features-section';
import { HeroSection } from './components/hero-section';
import { LandingFooter } from './components/landing-footer';
import { LandingNavbar } from './components/landing-navbar';
import { PopularRoutesSection } from './components/popular-routes-section';
import { SocialProofSection } from './components/social-proof-section';
import { TestimonialsSection } from './components/testimonials-section';

export interface HomepageSettings {
    homepage_hero?: {
        badge: string;
        headline: string;
        subheadline: string;
        stats: Array<{ value: string; label: string }>;
    };
    homepage_features?: Array<{
        icon: string;
        title: string;
        description: string;
    }>;
    homepage_testimonials?: Array<{
        name: string;
        text: string;
        avatar: string;
    }>;
    homepage_cta?: {
        headline: string;
        subheadline: string;
        primary_button: string;
        secondary_button: string;
    };
}

export interface TripRoute {
    id: number;
    name: string;
    branch?: { name: string };
}

interface WelcomeProps {
    settings?: HomepageSettings;
    routes?: TripRoute[];
}

export default function Welcome({ settings = {}, routes = [] }: WelcomeProps) {
    return (
        <>
            <Head title="Kapal Trip - Jelajahi Nusantara Tanpa Batas" />

            <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
                <LandingNavbar />
                <HeroSection settings={settings.homepage_hero} />
                <SocialProofSection />
                <FeaturesSection features={settings.homepage_features} />
                <PopularRoutesSection routes={routes} />
                <TestimonialsSection testimonials={settings.homepage_testimonials} />
                {/* <PromoSection /> */}
                <CTASection settings={settings.homepage_cta} />
                <LandingFooter />
            </div>

            <style>{`
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to { transform: translateX(calc(-100% - var(--gap))); }
                }
                .animate-marquee { animation: marquee linear infinite; }
            `}</style>
        </>
    );
}
