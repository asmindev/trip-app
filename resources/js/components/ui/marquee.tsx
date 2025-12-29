import { cn } from '@/lib/utils';

interface MarqueeProps {
    children: React.ReactNode;
    className?: string;
    reverse?: boolean;
    pauseOnHover?: boolean;
    speed?: 'slow' | 'normal' | 'fast';
}

export function Marquee({
    children,
    className,
    reverse = false,
    pauseOnHover = false,
    speed = 'normal',
}: MarqueeProps) {
    const speedMap = {
        slow: '60s',
        normal: '40s',
        fast: '20s',
    };

    return (
        <div
            className={cn(
                'group flex overflow-hidden [--gap:1rem] mask-[linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] py-6',
                className
            )}
        >
            <div
                className={cn(
                    'flex animate-marquee items-center gap-[--gap]',
                    pauseOnHover && 'group-hover:paused',
                    reverse && 'direction-[reverse]'
                )}
                style={{ animationDuration: speedMap[speed] }}
            >
                {children}
            </div>
            <div
                className={cn(
                    'flex animate-marquee items-center gap-[--gap]',
                    pauseOnHover && 'group-hover:paused',
                    reverse && 'direction-[reverse]'
                )}
                aria-hidden="true"
                style={{ animationDuration: speedMap[speed] }}
            >
                {children}
            </div>
        </div>
    );
}
