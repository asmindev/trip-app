// resources/js/pages/admin/ships/edit/page.tsx
import { Head } from '@inertiajs/react';
import { Ship } from '../components/schema';
import ShipForm from '../components/ship-form';

type Props = {
    ship: Ship;
    branches: { id: number; name: string }[];
};

export default function ShipEdit({ ship, branches }: Props) {
    return (
        <div className="mx-auto max-w-2xl space-y-6 p-6">
            <Head title={`Edit Kapal: ${ship.name}`} />

            <div>
                <h1 className="text-2xl font-bold">Edit Data Kapal</h1>
                <p className="text-muted-foreground">Ubah informasi operasional kapal.</p>
            </div>

            <ShipForm branches={branches} initialData={ship} mode="edit" />
        </div>
    );
}
