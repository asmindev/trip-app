import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { PaginatedData } from '@/types';


interface DataPaginationProps<T> {
    data: PaginatedData<T>;
}

export function DataPagination<T>({
    data
}: DataPaginationProps<T>) {
    // Safety check
    if (!data) return null;

    const {
        from,
        to,
        total,
        current_page,
        last_page,
        prev_page_url,
        next_page_url
    } = data;

    return (
        <div className="flex flex-col items-center justify-between gap-4 py-4 sm:flex-row">
            <div className="flex flex-1 items-center space-x-2 text-sm text-muted-foreground">
                <p>
                    Menampilkan <span className="font-medium text-foreground">{from || 0}</span> sampai{' '}
                    <span className="font-medium text-foreground">{to || 0}</span> dari{' '}
                    <span className="font-medium text-foreground">{total}</span> data
                </p>
            </div>

            <div className="flex items-center space-x-4 lg:space-x-8">
                <Pagination className="w-auto mx-0">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href={prev_page_url || '#'}
                                aria-disabled={!prev_page_url}
                                className={!prev_page_url ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                onClick={(e) => {
                                    if (!prev_page_url) e.preventDefault();
                                }}
                            />
                        </PaginationItem>

                        {(() => {
                            const getPageUrl = (page: number) => {
                                const url = new URL(window.location.href);
                                url.searchParams.set('page', page.toString());
                                return url.toString();
                            };

                            const generatePaginationLinks = (
                                currentPage: number,
                                totalPages: number,
                                siblingCount: number = 1
                            ) => {
                                const totalPageNumbers = siblingCount + 5;

                                if (totalPages <= totalPageNumbers) {
                                    return Array.from({ length: totalPages }, (_, i) => i + 1);
                                }

                                const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
                                const rightSiblingIndex = Math.min(
                                    currentPage + siblingCount,
                                    totalPages
                                );

                                const shouldShowLeftDots = leftSiblingIndex > 2;
                                const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

                                const firstPageIndex = 1;
                                const lastPageIndex = totalPages;

                                if (!shouldShowLeftDots && shouldShowRightDots) {
                                    const leftItemCount = 3 + 2 * siblingCount;
                                    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
                                    return [...leftRange, '...', totalPages];
                                }

                                if (shouldShowLeftDots && !shouldShowRightDots) {
                                    const rightItemCount = 3 + 2 * siblingCount;
                                    const rightRange = Array.from(
                                        { length: rightItemCount },
                                        (_, i) => totalPages - rightItemCount + i + 1
                                    );
                                    return [firstPageIndex, '...', ...rightRange];
                                }

                                if (shouldShowLeftDots && shouldShowRightDots) {
                                    const middleRange = Array.from(
                                        { length: rightSiblingIndex - leftSiblingIndex + 1 },
                                        (_, i) => leftSiblingIndex + i
                                    );
                                    return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
                                }

                                return [];
                            };

                            const pages = generatePaginationLinks(current_page, last_page);

                            return pages.map((page, i) => {
                                if (page === '...') {
                                    return (
                                        <PaginationItem key={`ellipsis-${i}`}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    );
                                }

                                const pageNum = page as number;
                                const isActive = current_page === pageNum;

                                return (
                                    <PaginationItem key={pageNum}>
                                        <PaginationLink
                                            href={getPageUrl(pageNum)}
                                            isActive={isActive}
                                        >
                                            {pageNum}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            });
                        })()}

                        <PaginationItem>
                            <PaginationNext
                                href={next_page_url || '#'}
                                aria-disabled={!next_page_url}
                                className={!next_page_url ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                onClick={(e) => {
                                    if (!next_page_url) e.preventDefault();
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
