import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ArrowRight, CheckCircle2, Edit, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import type { Passenger, Schedule } from '../types';
import { formatCurrency } from '../utils';

interface ReviewStepProps {
    passengers: Passenger[];
    schedule: Schedule;
    subtotal: number;
    discount: number;
    total: number;
    promoCode?: string;
    onBack: () => void;
    onConfirm: () => void;
    isSubmitting?: boolean;
}

export function ReviewStep({ passengers, schedule, subtotal, discount, total, promoCode, onBack, onConfirm, isSubmitting = false }: ReviewStepProps) {
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleConfirm = () => {
        if (!agreedToTerms) {
            return;
        }
        onConfirm();
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {/* Trip Details */}
            <Card className="overflow-hidden shadow-xl dark:ring-1 dark:ring-slate-800">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-orange-100/50 dark:from-primary/5 dark:to-orange-900/10">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                            <CheckCircle2 className="size-5" />
                        </div>
                        <CardTitle className="text-lg font-bold">Detail Perjalanan</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">Rute</p>
                                <p className="mt-1 font-semibold text-slate-900 dark:text-white">{schedule.route?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">Kapal</p>
                                <p className="mt-1 font-semibold text-slate-900 dark:text-white">{schedule.ship?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">Tanggal Berangkat</p>
                                <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                                    {new Date(schedule.departure_date).toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">Waktu</p>
                                <p className="mt-1 font-semibold text-slate-900 dark:text-white">{schedule.departure_time}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Passengers List */}
            <Card className="overflow-hidden shadow-xl dark:ring-1 dark:ring-slate-800">
                <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                            <Users className="size-5" />
                        </div>
                        <CardTitle className="text-lg font-bold">Daftar Penumpang ({passengers.length})</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
                        <Edit className="size-4" />
                        Edit
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {passengers.map((passenger, index) => (
                            <div key={index} className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                {index + 1}
                                            </span>
                                            <h4 className="font-bold text-slate-900 dark:text-white">{passenger.full_name}</h4>
                                            {passenger.is_booker && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Pemesan
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="ml-8 grid gap-2 text-sm sm:grid-cols-2">
                                            <div>
                                                <span className="text-slate-500">NIK:</span>{' '}
                                                <span className="font-medium text-slate-700 dark:text-slate-300">{passenger.id_card_number}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-500">WhatsApp:</span>{' '}
                                                <span className="font-medium text-slate-700 dark:text-slate-300">{passenger.whatsapp}</span>
                                            </div>
                                            {passenger.email && (
                                                <div className="sm:col-span-2">
                                                    <span className="text-slate-500">Email:</span>{' '}
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">{passenger.email}</span>
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-slate-500">Jenis Kelamin:</span>{' '}
                                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                                    {passenger.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Price Breakdown */}
            <Card className="overflow-hidden shadow-xl dark:ring-1 dark:ring-slate-800">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                    <CardTitle className="text-lg font-bold">Rincian Pembayaran</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Subtotal ({passengers.length} penumpang)</span>
                            <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
                        </div>

                        {discount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-green-600 dark:text-green-400">Diskon {promoCode && `(${promoCode})`}</span>
                                <span className="font-semibold text-green-600 dark:text-green-400">-{formatCurrency(discount)}</span>
                            </div>
                        )}

                        <Separator />

                        <div className="flex justify-between">
                            <span className="text-lg font-bold text-slate-900 dark:text-white">Total Pembayaran</span>
                            <span className="text-2xl font-black text-primary">{formatCurrency(total)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Terms & Conditions */}
            <Card className="border-orange-200 bg-orange-50/50 shadow-xl dark:border-orange-900/30 dark:bg-orange-950/10">
                <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                        <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(!!checked)} className="mt-1" />
                        <div className="flex-1">
                            <Label htmlFor="terms" className="cursor-pointer text-sm leading-relaxed font-medium text-slate-700 dark:text-slate-300">
                                Saya telah memeriksa data di atas dan menyetujui{' '}
                                <a href="#" className="font-bold text-primary underline hover:text-primary/80">
                                    Syarat dan Ketentuan
                                </a>{' '}
                                yang berlaku.
                            </Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="h-14 flex-1 gap-2 text-base font-bold"
                >
                    <ArrowLeft className="size-5" />
                    Kembali
                </Button>
                <Button
                    type="button"
                    size="lg"
                    onClick={handleConfirm}
                    disabled={!agreedToTerms || isSubmitting}
                    className="h-14 flex-1 gap-2 bg-primary text-base font-bold text-white hover:bg-primary/90"
                >
                    {isSubmitting ? 'Memproses...' : 'Konfirmasi & Lanjut ke Pembayaran'}
                    <ArrowRight className="size-5" />
                </Button>
            </div>
        </motion.div>
    );
}
