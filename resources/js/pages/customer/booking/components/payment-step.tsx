import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import axios from 'axios';
import { CheckCircle, Copy, CreditCard, Loader2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';
import type { Booking, Payment } from '../types';
import { PaymentMethodSelector, QrDisplay, VirtualAccountDisplay } from './payment-components';

interface PaymentStepProps {
    booking: Booking;
    onPaymentSuccess?: () => void;
}

export function PaymentStep({ booking, onPaymentSuccess }: PaymentStepProps) {
    const [status, setStatus] = useState<string>(booking.payment?.status || 'PENDING');
    const [payment, setPayment] = useState<Payment | undefined>(booking.payment);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (booking.payment) {
            setPayment(booking.payment);
            setStatus(booking.payment.status);
        }
    }, [booking.payment]);

    // Real-time payment updates via Laravel Echo
    useEcho(
        `payment.${booking.booking_code}`,
        'PaymentUpdated',
        (e: { status: string }) => {
            console.log('Payment updated:', e);
            setStatus(e.status);
            if (e.status === 'PAID') {
                router.reload({ only: ['booking'] });
                toast.success('Pembayaran berhasil dikonfirmasi!');
                onPaymentSuccess?.();
            } else if (e.status === 'EXPIRED') {
                toast.error('Waktu pembayaran telah habis.');
            }
        },
        [booking.booking_code],
        'private',
    );

    const handleSelectPaymentMethod = async (method: string) => {
        setIsProcessing(true);
        try {
            const response = await axios.post('/api/payment/pay', {
                booking_code: booking.booking_code,
                payment_method: method,
            });

            setPayment(response.data.payment);
            toast.success('Metode pembayaran dipilih. Silakan selesaikan pembayaran.');
        } catch (error: unknown) {
            console.error(error);
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message || 'Gagal memproses pembayaran');
            } else {
                toast.error('Terjadi kesalahan yang tidak diketahui');
            }
        } finally {
            setIsProcessing(false);
            router.reload({ only: ['booking'] });
        }
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                toast.success(`${label} berhasil disalin`);
            })
            .catch((e) => {
                console.error(e);
                toast.error(`Gagal menyalin ${label}`);
            });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <Card className="overflow-hidden shadow-xl dark:ring-1 dark:ring-slate-800">
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center dark:border-slate-800">
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Kode Booking</p>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{booking.booking_code}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(booking.booking_code, 'Kode Booking')}
                                className="h-8 w-8"
                            >
                                <Copy className="h-4 w-4 text-slate-400" />
                            </Button>
                        </div>
                    </div>
                    <Badge
                        variant={status === 'PAID' ? 'success' : status === 'PENDING' ? 'warning' : 'destructive'}
                        className="h-fit px-4 py-1.5 text-sm"
                    >
                        {status}
                    </Badge>
                </div>

                <CardContent className="p-6">
                    {/* Status: PENDING */}
                    {status === 'PENDING' && (
                        <div className="space-y-8">
                            {!payment ? (
                                <div className="space-y-4">
                                    <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                                        <CreditCard className="h-5 w-5 text-primary" />
                                        Pilih Metode Pembayaran
                                    </h3>
                                    <PaymentMethodSelector onSelect={handleSelectPaymentMethod} isLoading={isProcessing} />
                                </div>
                            ) : (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                                    {payment.payment_type === 'VIRTUAL_ACCOUNT' && (
                                        <VirtualAccountDisplay
                                            bankCode={payment.payment_channel}
                                            vaNumber={payment.payment_code}
                                            expiryDate={payment.expiration_date}
                                            amount={payment.amount}
                                            onExpire={() => setStatus('EXPIRED')}
                                        />
                                    )}

                                    {payment.payment_type === 'QR_CODE' && (
                                        <QrDisplay
                                            qrString={payment.payment_code}
                                            expiryDate={payment.expiration_date}
                                            amount={payment.amount}
                                            onExpire={() => setStatus('EXPIRED')}
                                        />
                                    )}

                                    <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-blue-50 p-6 text-center dark:bg-blue-900/10">
                                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                        <div>
                                            <p className="font-semibold text-blue-700 dark:text-blue-300">Menunggu Pembayaran</p>
                                            <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
                                                Halaman ini akan otomatis terupdate setelah Anda melakukan pembayaran.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <Button variant="ghost" onClick={() => setPayment(undefined)} className="text-slate-500 hover:text-red-500">
                                            Ganti Metode Pembayaran
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* Status: PAID */}
                    {status === 'PAID' && (
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-12 text-center">
                            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="mb-2 text-2xl font-black text-slate-900 dark:text-white">Pembayaran Berhasil!</h2>
                            <p className="mb-8 text-slate-600 dark:text-slate-400">
                                Terima kasih, tiket elektronik Anda telah terbit dan dikirim ke email.
                            </p>
                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <Button
                                    size="lg"
                                    onClick={() => window.open(route('booking.ticket', booking.booking_code), '_blank')}
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    Unduh Tiket (PDF)
                                </Button>
                                <Button variant="outline" size="lg" onClick={() => router.visit(route('booking.index'))}>
                                    Kembali ke Beranda
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Status: EXPIRED/FAILED */}
                    {(status === 'EXPIRED' || status === 'FAILED') && (
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-12 text-center">
                            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                                <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                            </div>
                            <h2 className="mb-2 text-2xl font-black text-slate-900 dark:text-white">
                                {status === 'EXPIRED' ? 'Waktu Habis' : 'Pembayaran Gagal'}
                            </h2>
                            <p className="mb-8 text-slate-600 dark:text-slate-400">
                                Maaf, sesi pembayaran untuk booking ini telah berakhir. Silakan lakukan pemesanan ulang.
                            </p>
                            <Button size="lg" onClick={() => router.visit(route('booking.index'))} className="bg-primary hover:bg-primary/90">
                                Pesan Ulang
                            </Button>
                        </motion.div>
                    )}
                </CardContent>
            </Card>

            <p className="text-center text-xs text-slate-400 dark:text-slate-600">Protected by 256-bit SSL encryption. Your transaction is secure.</p>
        </motion.div>
    );
}
