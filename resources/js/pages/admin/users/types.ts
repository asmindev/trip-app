import { Branch } from '@/pages/admin/branches/components/schema';

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions?: Permission[];
}

export interface Permission {
    id: number;
    name: string;
    guard_name: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string; // Legacy
    roles: Role[];
    branch_id?: number | null;
    branch?: Branch | null;
    created_at: string;
}

export interface UserFormData {
    name: string;
    email: string;
    password?: string;
    role: string;
    branch_id?: string;
}
