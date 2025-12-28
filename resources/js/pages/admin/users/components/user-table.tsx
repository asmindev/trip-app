import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, MoreHorizontal, Plus, Search, Trash2, UserCog } from 'lucide-react';
import React from 'react';
import { User } from '../types';

interface UserTableProps {
    users: User[];
    search: string;
    onSearchChange: (value: string) => void;
    onSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onCreateClick: () => void;
    onEditClick: (user: User) => void;
    onDeleteClick: (id: number) => void;
}

export function UserTable({ users, search, onSearchChange, onSearchKeyDown, onCreateClick, onEditClick, onDeleteClick }: UserTableProps) {
    const getRoleBadgeColor = (role: string) => {
        switch (role?.toLowerCase()) {
            case 'super-admin':
                return 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20';
            case 'admin':
                return 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20';
            case 'operator':
                return 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20';
            default:
                return 'bg-gray-500/10 text-gray-600 hover:bg-gray-500/20';
        }
    };

    return (
        <Card className="border-0 bg-gradient-to-br from-card to-muted/10 shadow-sm">
            <CardHeader className="border-b border-border/50 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                            <UserCog className="h-5 w-5 text-primary" />
                            User Management
                        </h2>
                        <p className="text-sm text-muted-foreground">Manage system access and roles</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search users..."
                                className="h-9 w-full border-border/50 bg-background/50 pl-9 transition-colors focus:bg-background sm:w-[220px]"
                                value={search}
                                onChange={(e) => onSearchChange(e.target.value)}
                                onKeyDown={onSearchKeyDown}
                            />
                        </div>
                        <Button onClick={onCreateClick} className="h-9 gap-2 shadow-sm">
                            <Plus className="h-4 w-4" />
                            <span>Add User</span>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-border/50 hover:bg-transparent">
                            <TableHead className="h-11 text-xs font-semibold tracking-wider text-muted-foreground/80 uppercase">User</TableHead>
                            <TableHead className="h-11 text-xs font-semibold tracking-wider text-muted-foreground/80 uppercase">Role</TableHead>
                            <TableHead className="h-11 text-xs font-semibold tracking-wider text-muted-foreground/80 uppercase">Branch</TableHead>
                            <TableHead className="h-11 text-xs font-semibold tracking-wider text-muted-foreground/80 uppercase">Joined</TableHead>
                            <TableHead className="h-11 w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                    No users found
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id} className="group border-b border-border/30 transition-colors hover:bg-muted/30">
                                    <TableCell className="py-3">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{user.name}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles.map((role) => (
                                                <Badge key={role.id} variant="secondary" className={`border-0 ${getRoleBadgeColor(role.name)}`}>
                                                    {role.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.branch ? (
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                <span>{user.branch.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(user.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onEditClick(user)} className="gap-2">
                                                    <Edit className="h-4 w-4" />
                                                    Edit Access
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => onDeleteClick(user.id)}
                                                    className="gap-2 text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete User
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
