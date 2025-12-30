import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { User } from '@/types';
import { BadgeCheck, Mail, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface BookerCardProps {
    user: User | null;
}

export function BookerCard({ user }: BookerCardProps) {
    if (!user) return null;

    return (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card className="overflow-hidden border-none shadow-xl shadow-slate-200/50 dark:shadow-none dark:ring-1 dark:ring-slate-800">
                <CardHeader className="bg-slate-50/50 px-6 py-5 dark:bg-slate-900/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <UserIcon className="size-5" />
                            </div>
                            <CardTitle className="text-lg font-bold">Data Pemesan</CardTitle>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold tracking-wider text-green-700 uppercase dark:bg-green-900/30 dark:text-green-400">
                            <BadgeCheck className="size-3" />
                            Terverifikasi
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6 p-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                            <UserIcon className="size-3" />
                            Nama Lengkap
                        </Label>
                        <div className="relative">
                            <Input
                                value={user.name}
                                disabled
                                className="h-12 border-slate-200 bg-slate-50 pl-4 font-semibold text-slate-900 disabled:opacity-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                            <Mail className="size-3" />
                            Email Terdaftar
                        </Label>
                        <div className="relative">
                            <Input
                                value={user.email}
                                disabled
                                className="h-12 border-slate-200 bg-slate-50 pl-4 font-semibold text-slate-900 disabled:opacity-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                            />
                        </div>
                    </div>
                </CardContent>
                <div className="bg-orange-50 px-6 py-3 text-[11px] font-medium text-orange-700 dark:bg-orange-950/20 dark:text-orange-400">
                    E-tiket akan dikirimkan ke alamat email di atas setelah pembayaran dikonfirmasi.
                </div>
            </Card>
        </motion.div>
    );
}
