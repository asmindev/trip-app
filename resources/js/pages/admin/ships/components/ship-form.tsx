// resources/js/pages/admin/ships/components/ship-form.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Link, useForm as useInertiaForm } from '@inertiajs/react';
import { type Ship, type ShipFormData } from './schema';

type Props = {
    branches: { id: number; name: string }[];
    initialData?: Ship; // Opsional: Ada jika mode Edit
    mode: 'create' | 'edit';
};

export default function ShipForm({ branches, initialData, mode }: Props) {
    // Setup Inertia Form Handlers
    const { data, setData, post, put, processing, errors } = useInertiaForm<ShipFormData>({
        branch_id: initialData?.branch_id ?? 0,
        name: initialData?.name ?? '',
        capacity: initialData?.capacity ?? 0,
        status: initialData?.status ?? 'ACTIVE',
        description: initialData?.description ?? '',
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'create') {
            post(route('admin.ships.store'));
        } else {
            put(route('admin.ships.update', initialData?.id));
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <Card>
                <CardContent className="space-y-4 pt-6">
                    {/* Branch Selection */}
                    <div className="space-y-2">
                        <Label>Cabang Operasional</Label>
                        <Select value={String(data.branch_id)} onValueChange={(val) => setData('branch_id', Number(val))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Cabang" />
                            </SelectTrigger>
                            <SelectContent>
                                {branches.map((branch) => (
                                    <SelectItem key={branch.id} value={String(branch.id)}>
                                        {branch.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.branch_id && <span className="text-sm text-red-500">{errors.branch_id}</span>}
                    </div>

                    {/* Name & Capacity (Grid) */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Nama Kapal</Label>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="KM. Bahteramas" />
                            {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                        </div>

                        <div className="space-y-2">
                            <Label>Kapasitas (Orang)</Label>
                            <Input type="number" value={data.capacity} onChange={(e) => setData('capacity', Number(e.target.value))} />
                            {errors.capacity && <span className="text-sm text-red-500">{errors.capacity}</span>}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label>Status Operasional</Label>
                        <Select value={data.status} onValueChange={(val: any) => setData('status', val)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ACTIVE">Active (Beroperasi)</SelectItem>
                                <SelectItem value="MAINTENANCE">Maintenance (Perbaikan)</SelectItem>
                                <SelectItem value="INACTIVE">Inactive (Tidak Aktif)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label>Deskripsi / Catatan (Opsional)</Label>
                        <Textarea value={data.description || ''} onChange={(e) => setData('description', e.target.value)} />
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                        <Link href={route('admin.ships.index')}>Batal</Link>
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Menyimpan...' : mode === 'create' ? 'Simpan Kapal' : 'Update Kapal'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
