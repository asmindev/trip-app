import { BookOpen, Bot, Building2, Settings2, SquareTerminal } from 'lucide-react';
import * as React from 'react';

import { usePermission } from '@/components/permissions';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { BranchSwitcher } from '@/sidebar/branch-switcher';
import { NavMain } from '@/sidebar/nav-main';
import { NavUser } from '@/sidebar/nav-user';
import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { can, hasRole, user } = usePermission();
    const { auth, sharedBranches } = usePage<PageProps>().props;

    // Data for Branch Switcher
    const branches = (sharedBranches || []).map((branch) => ({
        name: branch.name,
        logo: Building2,
        plan: branch.code,
        id: branch.id, // Add ID
    }));

    // Navigation Data
    const navMain = [];

    // 1. Master Data (Admin Only)
    if (hasRole(['admin', 'super-admin'])) {
        navMain.push({
            title: 'Master Data',
            url: '#',
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: 'Branches',
                    url: route('admin.branches.index'),
                },
                {
                    title: 'Ships',
                    url: route('admin.ships.index'),
                },
                {
                    title: 'Routes',
                    url: route('admin.trip-routes.index'),
                },
                {
                    title: 'Pricelists',
                    url: route('admin.pricelists.index'),
                },
            ],
        });
    }

    // 2. Operations (Admin & Operator)
    const operationItems = [];

    if (can('schedules.view-any')) {
        operationItems.push({
            title: 'Schedules',
            url: route('admin.schedules.index'),
        });
    }

    // Booking (Admin/Customer) - Operator usually just scans, but maybe view?
    // Based on permissions.ts: bookings.view-any for Admin/Operator
    if (can('bookings.view-any')) {
        // Note: Route might be different for admin vs customer
        // Using booking.index for now as per routes/web.php
        operationItems.push({
            title: 'Bookings',
            url: route('booking.index'),
        });
    }

    if (can('scan.view')) {
        // operationItems.push({
        //     title: "Scan Ticket",
        //     url: route('operator.scan.index'),
        // })
        // Route not yet defined in web.php, commenting out
    }

    if (operationItems.length > 0) {
        navMain.push({
            title: 'Operations',
            url: '#',
            icon: Bot,
            items: operationItems,
        });
    }

    // 3. Finance (Admin)
    if (hasRole(['admin', 'super-admin'])) {
        navMain.push({
            title: 'Finance',
            url: '#',
            icon: BookOpen,
            items: [
                {
                    title: 'Payments',
                    url: '#', // route('admin.payments.index')
                },
                {
                    title: 'Expenses',
                    url: '#', // route('admin.expenses.index')
                },
            ],
        });
    }

    // 4. Settings (Admin)
    if (hasRole(['admin', 'super-admin'])) {
        navMain.push({
            title: 'Settings',
            url: '#',
            icon: Settings2,
            items: [
                {
                    title: 'Users',
                    url: '#', // route('admin.users.index')
                },
                {
                    title: 'General',
                    url: '#', // route('admin.settings.index')
                },
            ],
        });
    }

    const userData = {
        name: user?.name || 'User',
        email: user?.email || 'user@example.com',
        avatar: user?.avatar || 'https://github.com/shadcn.png',
    };
    console.log(branches); // Array []

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>{branches.length > 0 && <BranchSwitcher branches={branches} />}</SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={userData} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
