import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    meta?: {
        from: number;
        to: number;
        total: number;
    };
}

export function PaginationLinks({ links, meta }: PaginationProps) {
    if (links.length === 3 && links[1].active) return null; // Single page

    return (
        <div className="flex items-center justify-between px-2 py-4">
            {meta && (
                <div className="text-sm text-muted-foreground">
                    Showing <strong>{meta.from ?? 0}</strong> to <strong>{meta.to ?? 0}</strong> of <strong>{meta.total ?? 0}</strong> results
                </div>
            )}
            <div className="flex items-center space-x-1">
                {links.map((link, i) => {
                    const isPrevious = link.label.includes('Previous');
                    const isNext = link.label.includes('Next');

                    if (isPrevious) {
                        return (
                            <Button
                                key={i}
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                disabled={!link.url}
                                asChild={!!link.url}
                            >
                                {link.url ? (
                                    <Link href={link.url} preserveScroll>
                                        <ChevronLeft className="h-4 w-4" />
                                        <span className="sr-only">Previous</span>
                                    </Link>
                                ) : (
                                    <span>
                                        <ChevronLeft className="h-4 w-4" />
                                        <span className="sr-only">Previous</span>
                                    </span>
                                )}
                            </Button>
                        );
                    }

                    if (isNext) {
                        return (
                            <Button
                                key={i}
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                disabled={!link.url}
                                asChild={!!link.url}
                            >
                                {link.url ? (
                                    <Link href={link.url} preserveScroll>
                                        <ChevronRight className="h-4 w-4" />
                                        <span className="sr-only">Next</span>
                                    </Link>
                                ) : (
                                    <span>
                                        <ChevronRight className="h-4 w-4" />
                                        <span className="sr-only">Next</span>
                                    </span>
                                )}
                            </Button>
                        );
                    }

                    // Ellipsis
                    if (link.url === null && link.label === '...') {
                         return (
                            <Button
                                key={i}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8"
                                disabled
                            >
                                ...
                            </Button>
                        );
                    }

                    return (
                        <Button
                            key={i}
                            variant={link.active ? "default" : "outline"}
                            size="sm"
                            className="h-8 w-8"
                            asChild={!!link.url}
                        >
                            {link.url ? (
                                <Link href={link.url} preserveScroll>
                                    {link.label}
                                </Link>
                            ) : (
                                <span>{link.label}</span>
                            )}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
