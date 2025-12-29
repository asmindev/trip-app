import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Check, Loader2, Tag, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface PromoInputProps {
    onApply: (code: string) => Promise<{ success: boolean; discount?: number; message?: string }>;
    onRemove: () => void;
    appliedCode?: string;
    discount?: number;
}

export function PromoInput({ onApply, onRemove, appliedCode, discount }: PromoInputProps) {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [shake, setShake] = useState(false);

    const handleApply = async () => {
        if (!code.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await onApply(code.trim().toUpperCase());

            if (!result.success) {
                setError(result.message || 'Kode promo tidak valid');
                setShake(true);
                setTimeout(() => setShake(false), 500);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (appliedCode) {
        return (
            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-full bg-green-500">
                            <Check className="size-4 text-white" />
                        </div>
                        <div>
                            <div className="font-medium text-green-700 dark:text-green-400">{appliedCode}</div>
                            {discount && (
                                <div className="text-sm text-green-600 dark:text-green-500">Hemat Rp {discount.toLocaleString('id-ID')}</div>
                            )}
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 text-green-600 hover:bg-green-100 hover:text-green-700"
                        onClick={onRemove}
                    >
                        <X className="size-4" />
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Tag className="size-4 text-primary" />
                    Kode Promo
                </CardTitle>
            </CardHeader>
            <CardContent>
                <motion.div animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }} className="flex gap-2">
                    <div className="flex-1">
                        <Input
                            placeholder="Masukkan kode promo"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            className="h-11 uppercase"
                            disabled={isLoading}
                        />
                    </div>
                    <Button type="button" variant="outline" className="h-11 px-6" onClick={handleApply} disabled={!code.trim() || isLoading}>
                        {isLoading ? <Loader2 className="size-4 animate-spin" /> : 'Terapkan'}
                    </Button>
                </motion.div>
                {error && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-sm text-red-500">
                        {error}
                    </motion.p>
                )}
            </CardContent>
        </Card>
    );
}
