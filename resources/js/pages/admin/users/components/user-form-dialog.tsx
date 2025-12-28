import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Branch } from '@/pages/admin/branches/components/schema';
import { useForm } from '@inertiajs/react'; // Inertia useForm
import { Loader2, Lock, Mail, Shield, User as UserIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Role, User, UserFormData } from '../types';

interface UserFormDialogProps {
    open: boolean;
    onClose: () => void;
    user?: User | null; // If null, mode is Create
    roles: Role[];
    branches: Branch[];
}

export function UserFormDialog({ open, onClose, user, roles, branches }: UserFormDialogProps) {
    const isEdit = !!user;

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<UserFormData>({
        name: '',
        email: '',
        password: '',
        role: '',
        branch_id: '',
    });

    useEffect(() => {
        if (open) {
            if (user) {
                setData({
                    name: user.name,
                    email: user.email,
                    password: '',
                    role: user.roles[0]?.name || '',
                    branch_id: user.branch_id?.toString() || '',
                });
            } else {
                reset();
            }
            clearErrors();
        }
    }, [open, user]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(route('admin.users.update', user.id), {
                onSuccess: () => {
                    toast.success('User updated successfully');
                    onClose();
                },
                onError: () => toast.error('Failed to update user'),
            });
        } else {
            post(route('admin.users.store'), {
                onSuccess: () => {
                    toast.success('User created successfully');
                    onClose();
                },
                onError: () => toast.error('Failed to create user'),
            });
        }
    };

    const showBranchSelection = data.role === 'operator';

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[500px]">
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 pb-4">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                            {isEdit ? <UserCog className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
                            {isEdit ? 'Edit User Access' : 'Create System User'}
                        </DialogTitle>
                        <DialogDescription>
                            {isEdit ? 'Modify user details, role, and branch access.' : 'Add a new user to the system.'}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form onSubmit={submit} className="space-y-4 p-6">
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <FormLabel htmlFor="name">Full Name</FormLabel>
                            <div className="relative">
                                <UserIcon className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    className="pl-9"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                            </div>
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>

                        <div className="grid gap-2">
                            <FormLabel htmlFor="email">Email Address</FormLabel>
                            <div className="relative">
                                <Mail className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    className="pl-9"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>
                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>

                        <div className="grid gap-2">
                            <FormLabel htmlFor="password">
                                Password {isEdit && <span className="font-normal text-muted-foreground">(Optional)</span>}
                            </FormLabel>
                            <div className="relative">
                                <Lock className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder={isEdit ? 'Leave blank to keep current' : 'Secure password'}
                                    className="pl-9"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <FormLabel>Assign Role</FormLabel>
                                <Select value={data.role} onValueChange={(val) => setData('role', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role.id} value={role.name}>
                                                <span className="capitalize">{role.name}</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                            </div>

                            {showBranchSelection && (
                                <div className="grid gap-2">
                                    <FormLabel>Assign Branch</FormLabel>
                                    <Select value={data.branch_id} onValueChange={(val) => setData('branch_id', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Branch" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {branches.map((branch) => (
                                                <SelectItem key={branch.id} value={branch.id.toString()}>
                                                    {branch.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.branch_id && <p className="text-sm text-destructive">{errors.branch_id}</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="gap-2">
                            {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isEdit ? 'Save Changes' : 'Create User'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function UserCog(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="18" cy="15" r="3" />
            <circle cx="9" cy="7" r="4" />
            <path d="M10 15H6a4 4 0 0 0-4 4v2" />
            <path d="m21.7 16.4.9-.9" />
            <path d="m15.3 22.8.9-.9" />
            <path d="m15.3 16.4.9-.9" />
            <path d="m21.7 22.8.9-.9" />
        </svg>
    );
}
