import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';
import { QrCode } from 'lucide-react';

export default function ScanIndex() {
    return (
        <AdminLayout title="Scan Tiket">
            <Head title="Scan Tiket" />

            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <QrCode className="h-6 w-6" />
                            Scan QR Code
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-12 text-center text-muted-foreground">
                            <QrCode className="h-16 w-16 opacity-20" />
                            <p>Kamera scanner akan muncul di sini.</p>
                            <p className="text-sm">Pastikan izin kamera aktif pada browser Anda.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
