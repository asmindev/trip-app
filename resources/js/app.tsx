import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { route } from 'ziggy-js';
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        const ziggyConfig = props.initialPage.props.ziggy;
        window.route = (name?: any, params?: any, absolute?: any, config: any = ziggyConfig) => route(name, params, absolute, config);

        root.render(
            <>
                <Toaster />
                <App {...props} />
            </>,
        );
    },
    progress: {
        color: 'var(--primary)',
    },
});
