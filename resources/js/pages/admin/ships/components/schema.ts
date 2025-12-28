import { z } from 'zod';

export const shipSchema = z.object({
    branch_id: z.coerce.number().min(1, 'Cabang harus dipilih'),
    name: z.string().min(3, 'Nama kapal minimal 3 karakter'),
    capacity: z.coerce.number().min(1, 'Kapasitas minimal 1 orang'),
    status: z.enum(['ACTIVE', 'MAINTENANCE', 'INACTIVE']),
    description: z.string().optional().nullable(),
});

export type ShipFormData = z.infer<typeof shipSchema>;

// Tipe data yang diterima dari Backend (Inertia Props)
export type Ship = {
    id: number;
    branch_id: number;
    name: string;
    capacity: number;
    status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
    description?: string;
    branch?: {
        id: number;
        name: string;
    };
};
