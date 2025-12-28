import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>('system');

    useEffect(() => {
        // Read theme from localStorage on mount
        const savedTheme = (localStorage.getItem('theme') as Theme) || 'system';
        setTheme(savedTheme);
        applyTheme(savedTheme);
    }, []);

    const applyTheme = (newTheme: Theme) => {
        const root = document.documentElement;

        if (newTheme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.toggle('dark', systemTheme === 'dark');
        } else {
            root.classList.toggle('dark', newTheme === 'dark');
        }
    };

    const changeTheme = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    };

    const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
        { value: 'light', label: 'Light', icon: <Sun className="size-4" /> },
        { value: 'dark', label: 'Dark', icon: <Moon className="size-4" /> },
        { value: 'system', label: 'System', icon: <Monitor className="size-4" /> },
    ];

    const currentIcon =
        theme === 'dark' ? <Moon className="size-4" /> : theme === 'light' ? <Sun className="size-4" /> : <Monitor className="size-4" />;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9">
                    {currentIcon}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-36 p-1">
                <div className="space-y-1">
                    {themes.map((t) => (
                        <button
                            key={t.value}
                            onClick={() => changeTheme(t.value)}
                            className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent ${
                                theme === t.value ? 'bg-accent font-medium' : ''
                            }`}
                        >
                            {t.icon}
                            <span>{t.label}</span>
                            {theme === t.value && <span className="ml-auto text-xs">✓</span>}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
