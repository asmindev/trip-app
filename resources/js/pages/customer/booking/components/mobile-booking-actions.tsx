import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ChevronUp, CreditCard } from 'lucide-react';
import type { Schedule } from '../types';
import { formatCurrency } from '../utils';
import { OrderSummary } from './order-summary';

interface MobileBookingActionsProps {
    total: number;
    schedule: Schedule;
    passengersCount: number;
    discount: number;
    isSubmitting: boolean;
}

export function MobileBookingActions({ total, schedule, passengersCount, discount, isSubmitting }: MobileBookingActionsProps) {
    return (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/80 p-4 shadow-[0_-8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl lg:hidden dark:border-slate-800 dark:bg-slate-900/80">
            <div className="mx-auto flex max-w-md items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Total Harga</span>
                    <span className="text-xl font-black text-primary">{formatCurrency(total)}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-12 rounded-xl text-slate-600 dark:text-slate-400">
                                <span className="mr-1 text-xs font-bold uppercase">Detail</span>
                                <ChevronUp className="size-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="h-[80vh] rounded-t-[2.5rem] border-t-0 p-0 shadow-2xl">
                            <div className="@container flex h-full flex-col">
                                <div className="flex shrink-0 items-center justify-center py-4">
                                    <div className="h-1.5 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
                                </div>
                                <div className="flex-1 overflow-y-auto px-6 pb-24">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white">Ringkasan Pesanan</h3>
                                        <p className="text-sm text-slate-500">Detail perjalanan dan rincian biaya</p>
                                    </div>
                                    <OrderSummary schedule={schedule} passengers={passengersCount} discount={discount} />
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-12 rounded-xl bg-primary px-6 font-black text-white shadow-lg shadow-orange-500/30 hover:bg-primary/90"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                BAYAR
                                <CreditCard className="size-4" />
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
