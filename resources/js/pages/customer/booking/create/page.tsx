import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import AppLayout from '@/layouts/app-layout';
import type { User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { ArrowRight, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { route } from 'ziggy-js';
import { z } from 'zod';
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
    gender: z.enum(['MALE', 'FEMALE']),
    age_group: z.enum(['ADULT', 'CHILD', 'INFANT']).default('ADULT'),
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
                    gender: 'MALE',
                    age_group: 'ADULT',
                    is_booker: false,
                },
            ],
        },
    });

    const { handleSubmit, watch } = methods;
    const passengers = watch('passengers');
    const basePrice = parseFloat(schedule.route?.pricelists?.[0]?.price || '150000');
    const total = basePrice * passengers.length + 5000 - discount;

    const onSubmit = async (data: BookingFormValues) => {
        setIsSubmitting(true);
        try {
            router.post(route('booking.store'), {
                schedule_id: schedule.id,
                passengers: data.passengers,
                promo_code: appliedPromo,
            });
        } catch {
            setIsSubmitting(false);
        }
    };

    const handlePromoApply = async (code: string) => {
        // Simulate API call - in real app, validate with backend
        await new Promise((resolve) => setTimeout(resolve, 1000));

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

            <div className="pt-20">
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <main className="container mx-auto px-4 py-8 pb-32 lg:pb-8">
                            {/* Step Indicator */}
                            <StepIndicator steps={steps} currentStep={currentStep} />

                            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                                {/* Left Column - Form */}
                                <div className="space-y-6 lg:col-span-7">
                                    {/* Contact Details Card */}
                                    <Card className="border-slate-200 dark:border-slate-800">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Data Pemesan</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label>Nama Lengkap</Label>
                                                    <Input value={auth.user?.name || ''} disabled className="h-11 bg-slate-100 dark:bg-slate-800" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Email</Label>
                                                    <Input value={auth.user?.email || ''} disabled className="h-11 bg-slate-100 dark:bg-slate-800" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Passenger Details */}
                                    <Card className="border-slate-200 dark:border-slate-800">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Data Penumpang</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <PassengerForm control={methods.control} bookerName={auth.user?.name} />
                                        </CardContent>
                                    </Card>

                                    {/* Promo Code */}
                                    <PromoInput
                                        onApply={handlePromoApply}
                                        onRemove={handlePromoRemove}
                                        appliedCode={appliedPromo}
                                        discount={discount}
                                    />

                                    {/* Terms & Submit - Desktop */}
                                    <div className="hidden lg:block">
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="h-14 w-full bg-orange-500 text-lg font-bold shadow-lg hover:bg-orange-600"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Memproses...' : 'Lanjut ke Pembayaran'}
                                            <ArrowRight className="ml-2 size-5" />
                                        </Button>
                                        <p className="mt-3 text-center text-xs text-slate-500">
                                            Dengan menekan tombol ini, Anda menyetujui{' '}
                                            <a href="#" className="text-primary underline">
                                                Syarat & Ketentuan
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                {/* Right Column - Order Summary (Desktop) */}
                                <div className="hidden lg:col-span-5 lg:block">
                                    <OrderSummary schedule={schedule} passengers={passengers.length} discount={discount} />
                                </div>
                            </div>
                        </main>

                        {/* Mobile Bottom Bar */}
                        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white p-4 lg:hidden dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-slate-500">Total Pembayaran</div>
                                    <div className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(total)}</div>
                                </div>
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="sm" className="text-primary">
                                            Detail
                                            <ChevronUp className="ml-1 size-4" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="bottom" className="h-[70vh] overflow-y-auto">
                                        <SheetHeader>
                                            <SheetTitle>Ringkasan Pesanan</SheetTitle>
                                        </SheetHeader>
                                        <div className="mt-4">
                                            <OrderSummary schedule={schedule} passengers={passengers.length} discount={discount} />
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                            <Button
                                type="submit"
                                className="mt-3 h-12 w-full bg-orange-500 text-base font-bold shadow-lg hover:bg-orange-600"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Memproses...' : 'Lanjut ke Pembayaran'}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </AppLayout>
    );
}
