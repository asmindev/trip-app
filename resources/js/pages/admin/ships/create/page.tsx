// resources/js/pages/admin/ships/create/page.tsx
import { Head } from '@inertiajs/react';
import ShipForm from '../components/ship-form';

type Props = {
    branches: { id: number; name: string }[];
};

export default function ShipCreate({ branches }: Props) {
    return (
        <div className="mx-auto max-w-2xl space-y-6 p-6">
            <Head title="Tambah Kapal Baru" />

            <div>
                <h1 className="text-2xl font-bold">Tambah Kapal</h1>
                <p className="text-muted-foreground">Daftarkan kapal baru ke dalam sistem.</p>
            </div>

            <ShipForm branches={branches} mode="create" />
        </div>
    );
}
