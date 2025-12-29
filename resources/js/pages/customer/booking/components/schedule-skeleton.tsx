import { Skeleton } from '@/components/ui/skeleton';

export function ScheduleCardSkeleton() {
    return (
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Left: Ship Info Skeleton */}
                <div className="flex items-center gap-4">
                    <Skeleton className="size-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>

                {/* Center: Timeline Skeleton */}
                <div className="flex flex-1 items-center justify-center gap-3 py-2 md:px-8">
                    <div className="text-center">
                        <Skeleton className="mx-auto mb-1 h-6 w-14" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex-1 px-4">
                        <Skeleton className="mx-auto mb-2 h-3 w-12" />
                        <Skeleton className="h-1 w-full" />
                    </div>
                    <div className="text-center">
                        <Skeleton className="mx-auto mb-1 h-6 w-14" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>

                {/* Right: Price & CTA Skeleton */}
                <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 md:flex-col md:items-end md:border-t-0 md:pt-0 dark:border-slate-800">
                    <div className="text-right">
                        <Skeleton className="mb-1 h-6 w-24" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-10 w-20" />
                </div>
            </div>
        </div>
    );
}

export function ScheduleListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <ScheduleCardSkeleton key={i} />
            ))}
        </div>
    );
}
