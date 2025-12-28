import { Head } from '@inertiajs/react';
import { CTASection } from './components/cta-section';
import { FeaturesSection } from './components/features-section';
import { HeroSection } from './components/hero-section';
import { LandingFooter } from './components/landing-footer';
import { LandingNavbar } from './components/landing-navbar';
import { PopularRoutesSection } from './components/popular-routes-section';
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
            <Head title="Kapal Trip - Jelajahi Surga Tersembunyi Indonesia" />

            <div className="min-h-screen bg-background text-foreground">
                <LandingNavbar />
                <HeroSection settings={settings.homepage_hero} />
                <FeaturesSection features={settings.homepage_features} />
                <PopularRoutesSection routes={routes} />
                <TestimonialsSection testimonials={settings.homepage_testimonials} />
                <CTASection settings={settings.homepage_cta} />
                <LandingFooter />
            </div>

            <style>{`
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to { transform: translateX(calc(-100% - var(--gap))); }
                }
                .animate-marquee { animation: marquee linear infinite; }

                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 6s ease infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }

                @keyframes draw {
                    from { stroke-dashoffset: 300; }
                    to { stroke-dashoffset: 0; }
                }
                .animate-draw {
                    stroke-dasharray: 300;
                    animation: draw 1.5s ease-out forwards;
                }

                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </>
    );
}
