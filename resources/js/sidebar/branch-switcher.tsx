import { router, usePage } from '@inertiajs/react'; // Import router and usePage
import { PageProps } from '@/types'; // Import PageProps
import { ChevronsUpDown, Plus } from 'lucide-react';
import * as React from 'react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';

export function BranchSwitcher({
    branches,
}: {
    branches: {
        name: string;
        logo: React.ElementType;
        plan: string;
        // We need the ID to switch
        id: number;
    }[];
}) {
    const { isMobile } = useSidebar();
    // Get activeBranch from global props
    const { activeBranch } = usePage<PageProps & { activeBranch?: { id: number; name: string; code: string } }>().props;

    // Find the full branch object from the passed branches array based on activeBranch.id
    // Fallback to first branch if no activeBranch
    const currentBranch = branches.find(b => b.id === activeBranch?.id) || branches[0];

    // Helper to switch branch
    const switchBranch = (branchId: number) => {
        router.post(route('admin.branches.switch'), { branch_id: branchId }, {
            preserveScroll: true,
            onSuccess: () => {
                // Optional: Toast or feedback
                console.log("Branch switched");
            }
        });
    };

    if (!currentBranch) {
        return null;
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <currentBranch.logo className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{currentBranch.name}</span>
                                <span className="truncate text-xs">{currentBranch.plan}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? 'bottom' : 'right'}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">Branches</DropdownMenuLabel>
                        {branches.map((branch) => (
                            <DropdownMenuItem
                                key={branch.name}
                                onClick={() => switchBranch(branch.id)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-sm border">
                                    <branch.logo className="size-4 shrink-0" />
                                </div>
                                {branch.name}
                                {currentBranch.name === branch.name && <span className="ml-auto text-xs font-bold">Active</span>}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2">
                            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                <Plus className="size-4" />
                            </div>
                            <div className="font-medium text-muted-foreground">Add Branch</div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
