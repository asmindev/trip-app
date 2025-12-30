export interface User {
    id: number;
    avatar?: string;
    name: string;
    email: string;
    phone?: string;
    email_verified_at?: string;
    branch_id?: number | null;
    roles: string[];
    permissions: string[];
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
}

export interface PaginatedData<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
    prev_page_url?: string | null;
    next_page_url?: string | null;
    first_page_url?: string | null;
    last_page_url?: string | null;
}

export interface Branch {
    id: number;
    name: string;
    code: string;
    location_address: string | null;
    status: 'ACTIVE' | 'INACTIVE';
    created_at?: string;
    updated_at?: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User | null;
    };
    sharedBranches: Branch[];
    branches?: PaginatedData<Branch> | Branch[]; // Allow both for now, or just generic
};
