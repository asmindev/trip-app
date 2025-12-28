import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Permission, Role } from '@/pages/admin/users/types';
import { router } from '@inertiajs/react';
import { ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface RoleMatrixProps {
    roles: Role[];
    groupedPermissions: Record<string, Permission[]>;
}

export function RoleMatrix({ roles, groupedPermissions }: RoleMatrixProps) {
    const [loading, setLoading] = useState<number | null>(null);
    const allGroups = Object.keys(groupedPermissions);
    const [expandedItems, setExpandedItems] = useState<string[]>(allGroups);

    const toggleExpandAll = () => {
        if (expandedItems.length === allGroups.length) {
            setExpandedItems([]);
        } else {
            setExpandedItems(allGroups);
        }
    };

    const isAllExpanded = expandedItems.length === allGroups.length;

    const getRoleParams = (roleName: string) => {
        switch (roleName.toLowerCase()) {
            case 'super-admin':
                return { color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' };
            case 'admin':
                return { color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' };
            case 'operator':
                return { color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' };
            case 'customer':
                return { color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200' };
            default:
                return { color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-200' };
        }
    };

    const handlePermissionChange = (roleId: number, permissionName: string, checked: boolean) => {
        const role = roles.find((r) => r.id === roleId);
        if (!role) return;

        // Prevent modification of super-admin
        if (role.name === 'super-admin') {
            toast.error('Super Admin permissions cannot be modified.');
            return;
        }

        const currentPermissions = role.permissions?.map((p) => p.name) || [];
        let newPermissions: string[];

        if (checked) {
            newPermissions = [...currentPermissions, permissionName];
        } else {
            newPermissions = currentPermissions.filter((p) => p !== permissionName);
        }

        setLoading(roleId);

        router.put(
            route('admin.roles.update', roleId),
            {
                permissions: newPermissions,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`Permissions for ${role.name} updated`);
                    setLoading(null);
                },
                onError: () => {
                    toast.error('Failed to update permissions');
                    setLoading(null);
                },
            },
        );
    };

    return (
        <Card className="border-0 bg-linear-to-br from-card to-muted/10 shadow-sm">
            <CardHeader className="border-b border-border/50 p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                            <ShieldAlert className="h-5 w-5 text-primary" />
                            Permission Matrix
                        </h2>
                        <p className="text-sm text-muted-foreground">Manage system access levels per role.</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={toggleExpandAll}>
                        {isAllExpanded ? 'Collapse All' : 'Expand All'}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Accordion type="multiple" value={expandedItems} onValueChange={setExpandedItems} className="w-full">
                    {Object.entries(groupedPermissions).map(([group, permissions]) => (
                        <AccordionItem key={group} value={group} className="border-b border-border/50 last:border-0">
                            <AccordionTrigger className="px-6 py-3 hover:bg-muted/30 hover:no-underline data-[state=open]:bg-muted/20">
                                <span className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                    {group.replace(/-/g, ' ')}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-border/30 bg-muted/5 hover:bg-transparent">
                                            <TableHead className="h-10 w-[300px] pl-10 text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
                                                Feature Access
                                            </TableHead>
                                            {roles.map((role) => {
                                                const style = getRoleParams(role.name);
                                                return (
                                                    <TableHead key={role.id} className="h-10 min-w-[100px] text-center">
                                                        <Badge
                                                            variant="outline"
                                                            className={`border ${style.bg} ${style.border} ${style.color} px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-sm`}
                                                        >
                                                            {role.name}
                                                        </Badge>
                                                    </TableHead>
                                                );
                                            })}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {permissions.map((perm) => (
                                            <TableRow
                                                key={perm.id}
                                                className="border-b border-border/30 transition-colors last:border-0 hover:bg-muted/10"
                                            >
                                                <TableCell className="relative py-2 pl-10 text-sm font-medium text-foreground/80">
                                                    <div className="absolute top-1/2 left-6 h-px w-2 -translate-y-1/2 bg-border"></div>
                                                    {perm.name}
                                                </TableCell>
                                                {roles.map((role) => {
                                                    const hasPermission =
                                                        role.permissions?.some((p) => p.id === perm.id) || role.name === 'super-admin';
                                                    const isRestricted = role.name === 'super-admin';
                                                    const isProcessing = loading === role.id;

                                                    return (
                                                        <TableCell key={`${role.id}-${perm.id}`} className="h-10 py-2 text-center">
                                                            <div className="flex h-full items-center justify-center">
                                                                {isRestricted ? (
                                                                    <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-primary/20">
                                                                        <div className="h-2 w-2 rounded-full bg-primary/50" />
                                                                    </div>
                                                                ) : (
                                                                    <Checkbox
                                                                        id={`perm-${role.id}-${perm.id}`}
                                                                        checked={hasPermission}
                                                                        disabled={isRestricted || isProcessing}
                                                                        onCheckedChange={(checked) =>
                                                                            handlePermissionChange(role.id, perm.name, checked as boolean)
                                                                        }
                                                                        className="data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                                                                    />
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}
