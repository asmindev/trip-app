import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import axios from 'axios';
import { CheckCircle, Copy, CreditCard, Loader2, Shield, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { BookingHeader } from './components/booking-header';
import { OrderSummary } from './components/order-summary';
import { PaymentMethodSelector, QrDisplay, VirtualAccountDisplay } from './components/payment-components';
import { Booking, Payment } from './types';

interface Props {
    booking: Booking;
}

export default function PaymentPage({ booking }: Props) {
    const { props } = usePage();
    const globalSettings = props.app_settings as { app_name?: string } | undefined;
    const appName = globalSettings?.app_name || 'Kapal Trip';

    const [status, setStatus] = useState<string>(booking.payment?.status || 'PENDING');
    const [payment, setPayment] = useState<Payment | undefined>(booking.payment);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (booking.payment) {
            setPayment(booking.payment);
            setStatus(booking.payment.status);
        }
    }, [booking.payment]);

    // Real-time updates
    useEcho(
        `payment.${booking.booking_code}`,
        'PaymentUpdated',
        (e: { status: string }) => {
            console.log('Payment updated:', e);
            setStatus(e.status);
            if (e.status === 'PAID') {
                router.reload({ only: ['booking'] });
                toast.success('Pembayaran berhasil dikonfirmasi!');
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
            // Refresh local data to ensure everything is in sync
            router.reload({ only: ['booking'] });
        }
    };

    const copyBookingCode = () => {
        console.log(booking);
        const xendit_id = booking.payment?.xendit_id || '';
        console.log(xendit_id);
        navigator.clipboard
            .writeText(xendit_id)
            .then(() => {
                toast.success('Kode Booking disalinn');
            })
            .catch((e) => {
                console.error(e);
                toast.error('Gagal menyalin Kode Booking');
            });
    };

    return (
        <AppLayout>
            <Head title={`Pembayaran #${booking.booking_code}`} />

            <BookingHeader schedule={booking.schedule} appName={appName} />

            <div className="relative z-20 -mt-20 pb-20">
                <main className="container mx-auto px-4">
                    {/* Floating Status Card (Desktop only, subtle) */}
                    <div className="mb-8 hidden justify-end md:flex">
                        <div className="flex items-center gap-3 rounded-full border border-white/20 bg-slate-900/40 px-6 py-3 shadow-2xl backdrop-blur-xl dark:bg-slate-800/40">
                            <div className="relative flex size-3 items-center justify-center">
                                <span
                                    className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${status === 'PAID' ? 'bg-green-400' : 'bg-orange-400'}`}
                                ></span>
                                <span
                                    className={`relative inline-flex size-2 rounded-full ${status === 'PAID' ? 'bg-green-500' : 'bg-orange-500'}`}
                                ></span>
                            </div>
                            <span className="text-sm font-bold tracking-wider text-white uppercase">
                                {status === 'PENDING' ? 'Menunggu Pembayaran' : status}
                            </span>
                        </div>
                    </div>

                    <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-10">
                        {/* Left Column: Payment Process */}
                        <div className="space-y-6 lg:col-span-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl md:p-8 dark:border-slate-800 dark:bg-slate-900"
                            >
                                <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-100 pb-8 sm:flex-row sm:items-center dark:border-slate-800">
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Kode Booking</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                                {booking.booking_code}
                                            </span>
                                            <Button variant="ghost" size="icon" onClick={copyBookingCode} className="h-8 w-8">
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
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="space-y-6"
                                            >
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
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => setPayment(null)}
                                                        className="text-slate-500 hover:text-red-500"
                                                    >
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
                                        <div className="flex justify-center gap-4">
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
                                        <Button
                                            size="lg"
                                            onClick={() => router.visit(route('booking.index'))}
                                            className="bg-primary hover:bg-primary/90"
                                        >
                                            Pesan Ulang
                                        </Button>
                                    </motion.div>
                                )}
                            </motion.div>

                            <p className="text-center text-xs text-slate-400 dark:text-slate-600">
                                Protected by 256-bit SSL encryption. Your transaction is secure.
                            </p>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="relative mt-10 lg:col-span-4 lg:mt-0">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="sticky top-28 space-y-6"
                            >
                                <OrderSummary
                                    schedule={booking.schedule}
                                    passengers={booking.passengers.length}
                                    discount={booking.discount_amount || 0}
                                    subtotal={booking.subtotal}
                                    totalAmount={booking.total_amount}
                                />

                                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/20">
                                    <div className="flex gap-3">
                                        <Shield className="h-6 w-6 shrink-0 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <h4 className="font-bold text-blue-900 dark:text-blue-100">Pembayaran Aman</h4>
                                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                                Kami menggunakan gateway pembayaran terpercaya untuk menjamin keamanan transaksi Anda.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </main>
            </div>
        </AppLayout>
    );
}
