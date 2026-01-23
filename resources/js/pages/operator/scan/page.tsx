import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';
import { Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';
import { CheckCircle2, QrCode, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ScanResult {
    status: 'success' | 'error';
    message: string;
    data?: {
        passenger: string;
        seat: string;
        ship: string;
    };
}

export default function ScanPage() {
    const [scanning, setScanning] = useState(true);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleScan = async (detectedCodes: { rawValue: string }[]) => {
        if (!scanning || processing || detectedCodes.length === 0) return;

        const code = detectedCodes[0].rawValue;
        if (!code) return;

        setScanning(false);
        setProcessing(true);

        try {
            const response = await axios.post('/scan/process', { code });
            setResult(response.data);
            toast.success('Scan berhasil!');
        } catch (error: any) {
            setResult({
                status: 'error',
                message: error.response?.data?.message || 'Terjadi kesalahan saat validasi tiket.',
            });
            toast.error('Scan gagal!');
        } finally {
            setProcessing(false);
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setResult(null);
        // Delay re-enabling scan to prevent accidental double scans
        setTimeout(() => setScanning(true), 1000);
    };

    return (
        <AdminLayout title="Scan Tiket">
            <Head title="Scan Tiket" />

            <div className="mx-auto flex max-w-md flex-col gap-6">
                <Card className="overflow-hidden">
                    <CardHeader className="bg-muted/50 pb-8">
                        <CardTitle className="flex flex-col items-center gap-2 text-center">
                            <QrCode className="h-8 w-8 text-primary" />
                            <span>Scan QR Code</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="-mt-6 p-6 pt-0">
                        <div className="aspect-square overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/25 bg-black">
                            {scanning ? (
                                <Scanner
                                    onScan={handleScan}
                                    components={{
                                        audio: false,
                                        onOff: true,
                                        torch: true,
                                    }}
                                    styles={{
                                        container: { width: '100%', height: '100%' },
                                    }}
                                />
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center text-white">
                                    <p>Memproses...</p>
                                </div>
                            )}
                        </div>
                        <p className="mt-4 text-center text-sm text-muted-foreground">Arahkan kamera ke QR Code tiket penumpang.</p>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={showModal} onOpenChange={(open) => !open && handleCloseModal()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {result?.status === 'success' ? (
                                <>
                                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                                    <span>Tiket Valid</span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-6 w-6 text-red-500" />
                                    <span>Tiket Invalid</span>
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription>{result?.message}</DialogDescription>
                    </DialogHeader>

                    {result?.status === 'success' && result.data && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 items-center gap-4">
                                <span className="text-sm font-medium text-muted-foreground">Penumpang</span>
                                <span className="font-semibold">{result.data.passenger}</span>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4">
                                <span className="text-sm font-medium text-muted-foreground">Kursi</span>
                                <span className="font-semibold">{result.data.seat}</span>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4">
                                <span className="text-sm font-medium text-muted-foreground">Kapal</span>
                                <span className="font-semibold">{result.data.ship}</span>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="sm:justify-start">
                        <Button type="button" variant="default" className="w-full" onClick={handleCloseModal}>
                            Scan Lagi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
