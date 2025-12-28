import { type SVGProps, useEffect } from 'react';

import {
    Banknote,
    BookOpen,
    Building2,
    Building2 as Building2Icon,
    Calendar,
    CreditCard,
    LayoutDashboard,
    Map,
    Shield,
    Ship,
    Users,
} from 'lucide-react';

import { Can } from '@/components/permissions';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { Permission } from '@/lib/permissions';
import { BranchSwitcher } from '@/sidebar/branch-switcher';
import { NavUser } from '@/sidebar/nav-user';
import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

type NavItem = {
    label: string;
    routeName?: string; // Ziggy route name
    icon?: React.FC<SVGProps<SVGSVGElement>>;
    permission: Permission;
    children?: NavItem[];
};

const navigation: NavItem[] = [
    {
        label: 'Dashboard',
        permission: 'dashboard.view',
        children: [{ label: 'Overview', routeName: 'admin.dashboard', icon: LayoutDashboard, permission: 'dashboard.view' }],
    },
    {
        label: 'Operasional',
        permission: 'schedules.view-any',
        children: [
            { label: 'Jadwal', routeName: 'admin.schedules.index', icon: Calendar, permission: 'schedules.view-any' },
            { label: 'Booking', routeName: 'admin.bookings.index', icon: BookOpen, permission: 'bookings.view-any' },
            { label: 'Payment', routeName: 'admin.payments.index', icon: CreditCard, permission: 'payments.view-any' },
        ],
    },
    {
        label: 'Master Data',
        permission: 'branches.view-any',
        children: [
            { label: 'Cabang', routeName: 'admin.branches.index', icon: Building2, permission: 'branches.view-any' },
            { label: 'Kapal', routeName: 'admin.ships.index', icon: Ship, permission: 'ships.view-any' },
            { label: 'Rute', routeName: 'admin.trip-routes.index', icon: Map, permission: 'routes.view-any' },
            { label: 'Harga', routeName: 'admin.pricelists.index', icon: Banknote, permission: 'pricelists.view-any' },
        ],
    },
    {
        label: 'Pengaturan',
        permission: 'users.view-any',
        children: [
            { label: 'Users', routeName: 'admin.users.index', icon: Users, permission: 'users.view-any' },
            { label: 'Roles', routeName: 'admin.roles.index', icon: Shield, permission: 'roles.view-any' },
        ],
    },
];

export function AdminSidebar() {
    const { props } = usePage();
    const auth = props.auth as { user: { id: number; name: string; email: string } | null };
    const sharedBranches = (props.sharedBranches as any[]) || [];
    const { state } = useSidebar();

    // Prepare branches for BranchSwitcher
    const branches = sharedBranches.map((branch) => ({
        name: branch.name,
        logo: Building2Icon,
        plan: branch.code,
        id: branch.id,
    }));

    // Menggunakan Ziggy untuk check active route
    const isActive = (routeName: string) => {
        return route().current(routeName) || route().current(`${routeName}.*`);
    };

    // Restore scroll position
    useEffect(() => {
        const sidebarContent = document.querySelector('[data-sidebar="content"]');
        if (sidebarContent) {
            const savedScroll = sessionStorage.getItem('sidebar-scroll');
            if (savedScroll) {
                sidebarContent.scrollTop = parseInt(savedScroll, 10);
            }

            const handleScroll = () => {
                sessionStorage.setItem('sidebar-scroll', sidebarContent.scrollTop.toString());
            };

            sidebarContent.addEventListener('scroll', handleScroll);
            return () => sidebarContent.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>{branches.length > 0 && <BranchSwitcher branches={branches} />}</SidebarHeader>

            <SidebarContent className="w-full">
                {navigation.map((section) => (
                    <SidebarGroup key={section.label}>
                        <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
                        <SidebarMenu>
                            {section.children?.map((item) => {
                                const Icon = item.icon;
                                if (!item.routeName) return null;

                                const active = isActive(item.routeName);

                                return (
                                    <Can key={item.routeName} permission={item.permission}>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                asChild
                                                tooltip={item.label}
                                                className={`${active ? 'bg-primary font-medium text-primary-foreground hover:bg-primary hover:text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
                                            >
                                                <Link href={route(item.routeName)}>
                                                    {Icon && <Icon className="size-4" />}
                                                    <span>{item.label}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </Can>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}

                {state === 'expanded' && (
                    <SidebarGroup className="mx-auto w-11/12 rounded-lg border p-3 text-sm">
                        <div className="flex items-center gap-3">
                            <Shield className="size-4" />
                            <p className="font-semibold">Keamanan & audit</p>
                        </div>
                        <p className="mt-2 text-xs">Aktifkan MFA dan tinjau log aktivitas mingguan.</p>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser
                    user={{
                        name: auth.user?.name || 'Guest',
                        email: auth.user?.email || '',
                        avatar: '',
                    }}
                />
            </SidebarFooter>
        </Sidebar>
    );
}
