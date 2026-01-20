import { ThemeToggle } from '@/components/theme-toggle';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/sidebar/admin-sidebar';
import { Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface BreadcrumbItemType {
    title: string;
    url: string;
}

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    breadcrumbs?: BreadcrumbItemType[];
}

export default function AdminLayout({ children, title, breadcrumbs }: AdminLayoutProps) {
    const { props } = usePage();

    useEffect(() => {
        const flash = props.flash as { type: 'success' | 'error' | 'message' | null; content: string | null };

        if (flash.content) {
            toast[flash.type ?? 'message'](flash.content);
        }
    }, [props.flash]);

    const sidebarOpen = (props.sidebarOpen as boolean) ?? true;

    return (
        <SidebarProvider defaultOpen={sidebarOpen}>
            <AdminSidebar />
            <SidebarInset className="relative flex min-w-0 flex-col">
                <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b border-border/40 bg-background/95 backdrop-blur transition-[width,height] ease-linear group-has-[data-collapsible=icon]/sidebar-wrapper:h-12 supports-backdrop-filter:bg-background/60">
                    <div className="flex w-full items-center justify-between gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href={route('admin.dashboard')}>Trip App</BreadcrumbLink>
                                </BreadcrumbItem>
                                {breadcrumbs
                                    ? breadcrumbs.map((crumb, index) => (
                                          <div key={index} className="flex items-center gap-2">
                                              <BreadcrumbSeparator className="hidden md:block" />
                                              <BreadcrumbItem>
                                                  {crumb.url !== '#' ? (
                                                      <BreadcrumbLink asChild>
                                                          <Link href={crumb.url}>{crumb.title}</Link>
                                                      </BreadcrumbLink>
                                                  ) : (
                                                      <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                                                  )}
                                              </BreadcrumbItem>
                                          </div>
                                      ))
                                    : title && (
                                          <>
                                              <BreadcrumbSeparator className="hidden md:block" />
                                              <BreadcrumbItem>
                                                  <BreadcrumbPage>{title}</BreadcrumbPage>
                                              </BreadcrumbItem>
                                          </>
                                      )}
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className="ml-auto">
                            <ThemeToggle />
                        </div>
                    </div>
                </header>
                <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-auto p-4 pt-0">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
