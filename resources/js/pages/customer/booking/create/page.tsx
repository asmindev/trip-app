import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { route } from 'ziggy-js';
import { z } from 'zod';
import { BookerCard } from '../components/booker-card';
import { BookingHeader } from '../components/booking-header';
import { MobileBookingActions } from '../components/mobile-booking-actions';
import { OrderSummary } from '../components/order-summary';
import { PassengerForm } from '../components/passenger-form';
import { PromoInput } from '../components/promo-input';
import { ReviewStep } from '../components/review-step';
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
    email: z.string().email().optional().or(z.literal('')),
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

    // Wizard state (only 2 steps now - step 3 is separate payment page)
    const [currentStep, setCurrentStep] = useState(1);
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
                    email: '',
                    gender: 'MALE',
                    age_group: 'ADULT',
                    is_booker: false,
                },
            ],
        },
    });

    const { watch, trigger } = methods;
    const passengers = watch('passengers');
    const basePrice = parseFloat(schedule.route?.pricelists?.[0]?.price_public || '150000');
    const subtotal = basePrice * passengers.length;
    const total = subtotal - discount;

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

    const handleNextStep = async () => {
        if (currentStep === 1) {
            // Validate passenger data before going to review
            const isValid = await trigger('passengers');
            if (!isValid) {
                toast.error('Mohon lengkapi data penumpang dengan benar');
                return;
            }
            setCurrentStep(2);
        }
    };

    const handleBackStep = () => {
        if (currentStep === 2) {
            setCurrentStep(1);
        }
    };

    const handleConfirmBooking = async () => {
        setIsSubmitting(true);
        try {
            const formData = methods.getValues();

            const response = await axios.post(
                route('booking.store'),
                {
                    schedule_id: schedule.id,
                    passengers: formData.passengers,
                    promo_code: appliedPromo,
                },
                {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        Accept: 'application/json',
                    },
                },
            );

            if (response.data.success) {
                const bookingCode = response.data.booking_code;
                toast.success('Booking berhasil dibuat! Mengarahkan ke halaman pembayaran...');

                // Redirect to dedicated payment page instead of staying in wizard
                // This prevents state loss on refresh
                setTimeout(() => {
                    router.visit(route('booking.payment', bookingCode));
                }, 500);
            }
        } catch (error: unknown) {
            console.error(error);
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message || 'Gagal membuat booking');
            } else {
                toast.error('Terjadi kesalahan yang tidak diketahui');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const steps = [
        { id: 1, name: 'Data Penumpang' },
        { id: 2, name: 'Review & Konfirmasi' },
    ];

    return (
        <AppLayout>
            <Head title={`Pemesanan - ${schedule.route?.name || appName}`} />

            <BookingHeader schedule={schedule} appName={appName} />

            <div className="relative z-20 -mt-20">
                <FormProvider {...methods}>
                    <main className="container mx-auto px-4 pb-40 lg:pb-24">
                        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-10">
                            {/* Left Column - Wizard Content */}
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

                                {/* Step 1: Passenger Form */}
                                {currentStep === 1 && (
                                    <>
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
                                                        bookerEmail={auth.user?.email}
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

                                        {/* Next Button for Step 1 */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="flex justify-end"
                                        >
                                            <Button
                                                type="button"
                                                size="lg"
                                                onClick={handleNextStep}
                                                className="h-14 gap-2 bg-primary px-8 text-base font-bold text-white hover:bg-primary/90"
                                            >
                                                Lanjut ke Review
                                                <ArrowRight className="size-5" />
                                            </Button>
                                        </motion.div>
                                    </>
                                )}

                                {/* Step 2: Review */}
                                {currentStep === 2 && (
                                    <ReviewStep
                                        passengers={passengers}
                                        schedule={schedule}
                                        subtotal={subtotal}
                                        discount={discount}
                                        total={total}
                                        promoCode={appliedPromo}
                                        onBack={handleBackStep}
                                        onConfirm={handleConfirmBooking}
                                        isSubmitting={isSubmitting}
                                    />
                                )}
                            </div>

                            {/* Right Column - Summary & Desktop CTA */}
                            <aside className="hidden lg:sticky lg:top-32 lg:col-span-4 lg:block">
                                <div className="space-y-6">
                                    <OrderSummary
                                        schedule={schedule}
                                        passengers={passengers.length}
                                        discount={discount}
                                        subtotal={subtotal}
                                        totalAmount={total}
                                    />

                                    {currentStep === 1 && (
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
                                                type="button"
                                                onClick={handleNextStep}
                                                className="group h-16 w-full rounded-2xl bg-primary text-lg font-black tracking-wider text-white shadow-xl shadow-orange-500/20 hover:bg-primary/90 dark:bg-white dark:text-slate-900"
                                            >
                                                LANJUT KE REVIEW
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
                                    )}
                                </div>
                            </aside>
                        </div>
                    </main>

                    {/* Mobile Actions Overlay - Only for Step 1 */}
                    {currentStep === 1 && (
                        <MobileBookingActions
                            total={total}
                            schedule={schedule}
                            passengersCount={passengers.length}
                            discount={discount}
                            isSubmitting={false}
                            onSubmit={handleNextStep}
                        />
                    )}
                </FormProvider>
            </div>
        </AppLayout>
    );
}
