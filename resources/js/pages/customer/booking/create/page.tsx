import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { route } from 'ziggy-js';
import { z } from 'zod';
import { BookerCard } from '../components/booker-card';
import { BookingHeader } from '../components/booking-header';
import { MobileBookingActions } from '../components/mobile-booking-actions';
import { OrderSummary } from '../components/order-summary';
import { PassengerForm } from '../components/passenger-form';
import { PromoInput } from '../components/promo-input';
import { StepIndicator } from '../components/step-indicator';
import type { Schedule } from '../types';
import { formatCurrency } from '../utils';

// Zod Schema
const passengerSchema = z.object({
    full_name: z.string().min(3, 'Nama minimal 3 karakter'),
    id_card_number: z.string().length(16, 'NIK harus 16 digit'),
    whatsapp: z
        .string()
        .min(10, 'Nomor WA minimal 10 digit')
        .max(15, 'Nomor WA maksimal 15 digit')
        .regex(/^[0-9]+$/, 'Hanya angka yang diperbolehkan'),
    gender: z.enum(['MALE', 'FEMALE']),
    age_group: z.enum(['ADULT', 'CHILD', 'INFANT']),
    is_booker: z.boolean().optional(),
});

const bookingSchema = z.object({
    passengers: z.array(passengerSchema).min(1, 'Minimal 1 penumpang'),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface PageProps {
    schedule: Schedule;
}

export default function BookingCreatePage({ schedule }: PageProps) {
    const { props } = usePage();
    const globalSettings = props.app_settings as { app_name?: string } | undefined;
    const appName = globalSettings?.app_name || 'Kapal Trip';
    const auth = props.auth as { user: User | null };
    const [currentStep] = useState(2);
    const [discount, setDiscount] = useState(0);
    const [appliedPromo, setAppliedPromo] = useState<string | undefined>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const methods = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            passengers: [
                {
                    full_name: '',
                    id_card_number: '',
                    whatsapp: '',
                    gender: 'MALE',
                    age_group: 'ADULT',
                    is_booker: false,
                },
            ],
        },
    });

    const { handleSubmit, watch } = methods;
    const passengers = watch('passengers');
    const basePrice = parseFloat(schedule.route?.pricelists?.[0]?.price_public || '150000');
    const total = basePrice * passengers.length - discount;

    const onSubmit = async (data: BookingFormValues) => {
        setIsSubmitting(true);
        try {
            router.post(
                route('booking.store'),
                {
                    schedule_id: schedule.id,
                    passengers: data.passengers,
                    promo_code: appliedPromo,
                },
                {
                    replace: true, // Prevent going back to this form after success
                },
            );
        } catch {
            setIsSubmitting(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePromoApply = async (code: string) => {
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (code === 'DISKON10') {
            setDiscount(15000);
            setAppliedPromo(code);
            return { success: true, discount: 15000 };
        }
        return { success: false, message: 'Kode promo tidak ditemukan' };
    };

    const handlePromoRemove = () => {
        setDiscount(0);
        setAppliedPromo(undefined);
    };

    const steps = [
        { id: 1, name: 'Data Pemesan' },
        { id: 2, name: 'Data Penumpang' },
        { id: 3, name: 'Review' },
        { id: 4, name: 'Bayar' },
    ];

    return (
        <AppLayout>
            <Head title={`Pemesanan - ${schedule.route?.name || appName}`} />

            <BookingHeader schedule={schedule} appName={appName} />

            <div className="relative z-20 -mt-20">
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <main className="container mx-auto px-4 pb-40 lg:pb-24">
                            <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-10">
                                {/* Left Column - All Forms */}
                                <div className="space-y-8 lg:col-span-8">
                                    {/* Step Indicator */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="rounded-3xl border border-slate-200 bg-white/60 p-8 shadow-xl backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 dark:shadow-none"
                                    >
                                        <StepIndicator steps={steps} currentStep={currentStep} />
                                    </motion.div>

                                    {/* Booker Info */}
                                    <BookerCard user={auth.user} />

                                    {/* Passengers Form */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.1 }}
                                    >
                                        <Card className="overflow-hidden p-0 shadow-xl shadow-slate-200/50 dark:shadow-none dark:ring-1 dark:ring-slate-800">
                                            <CardHeader className="bg-slate-50/50 px-6 py-3 dark:bg-slate-900/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                        <Sparkles className="size-5" />
                                                    </div>
                                                    <CardTitle className="text-lg font-bold">Data Penumpang</CardTitle>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <PassengerForm
                                                    control={methods.control}
                                                    bookerName={auth.user?.name}
                                                    bookerPhone={auth.user?.phone}
                                                />
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Promo */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    >
                                        <PromoInput
                                            onApply={handlePromoApply}
                                            onRemove={handlePromoRemove}
                                            appliedCode={appliedPromo}
                                            discount={discount}
                                        />
                                    </motion.div>
                                </div>

                                {/* Right Column - Summary & Desktop CTA */}
                                <aside className="hidden lg:sticky lg:top-32 lg:col-span-4 lg:block">
                                    <div className="space-y-6">
                                        <OrderSummary schedule={schedule} passengers={passengers.length} discount={discount} />

                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl dark:bg-primary"
                                        >
                                            <div className="mb-6 flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-400 dark:text-orange-100">Total Pembayaran</span>
                                                <span className="text-2xl font-black italic">{formatCurrency(total)}</span>
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="group h-16 w-full rounded-2xl bg-primary text-lg font-black tracking-wider text-white shadow-xl shadow-orange-500/20 hover:bg-primary/90 dark:bg-white dark:text-slate-900"
                                            >
                                                {isSubmitting ? 'MEMPROSES...' : 'BAYAR SEKARANG'}
                                                <ArrowRight className="ml-2 size-6 transition-transform group-hover:translate-x-1" />
                                            </Button>

                                            <p className="mt-4 text-center text-[10px] font-medium text-slate-500 dark:text-orange-200">
                                                Dengan melanjutkan, Anda menyetujui{' '}
                                                <a href="#" className="underline">
                                                    Syarat & Layanan
                                                </a>{' '}
                                                kami.
                                            </p>
                                        </motion.div>
                                    </div>
                                </aside>
                            </div>
                        </main>

                        {/* Mobile Actions Overlay */}
                        <MobileBookingActions
                            total={total}
                            schedule={schedule}
                            passengersCount={passengers.length}
                            discount={discount}
                            isSubmitting={isSubmitting}
                        />
                    </form>
                </FormProvider>
            </div>
        </AppLayout>
    );
}
