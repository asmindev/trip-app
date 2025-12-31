import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Check, Copy, CreditCard, Landmark, QrCode, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PaymentMethodSelectorProps {
    onSelect: (method: string) => void;
    isLoading: boolean;
}

export function PaymentMethodSelector({ onSelect, isLoading }: PaymentMethodSelectorProps) {
    const [selected, setSelected] = useState('BCA');

    const handlePay = () => {
        onSelect(selected);
    };

    const methods = [
        { id: 'BCA', name: 'BCA Virtual Account', icon: Landmark, desc: 'Automatic Verification' },
        { id: 'BRI', name: 'BRI Virtual Account', icon: Landmark, desc: 'Automatic Verification' },
        { id: 'MANDIRI', name: 'Mandiri Bill', icon: Landmark, desc: 'Automatic Verification' },
        { id: 'QRIS', name: 'QRIS', icon: QrCode, desc: 'Scan with any e-wallet' },
    ];

    return (
        <div className="space-y-6">
            <RadioGroup defaultValue="BCA" onValueChange={setSelected} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {methods.map((method) => (
                    <motion.div key={method.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <RadioGroupItem value={method.id} id={method.id} className="peer sr-only" />
                        <Label
                            htmlFor={method.id}
                            className="relative flex cursor-pointer flex-col justify-between rounded-xl border-2 border-slate-100 bg-white p-5 transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:peer-data-[state=checked]:border-primary dark:peer-data-[state=checked]:bg-primary/10 dark:hover:bg-slate-800"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <div className="rounded-lg bg-slate-100 p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                    <method.icon className="h-6 w-6" />
                                </div>
                                {selected === method.id && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="rounded-full bg-primary p-1 text-white">
                                        <Check className="h-3 w-3" />
                                    </motion.div>
                                )}
                            </div>
                            <div>
                                <span className="block text-lg font-bold text-slate-900 dark:text-white">{method.name}</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">{method.desc}</span>
                            </div>
                        </Label>
                    </motion.div>
                ))}
            </RadioGroup>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                    onClick={handlePay}
                    disabled={isLoading}
                    className="h-14 w-full rounded-xl bg-primary text-lg font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
                >
                    {isLoading ? 'Processing...' : `Pay with ${methods.find((m) => m.id === selected)?.name}`}
                </Button>
            </motion.div>
        </div>
    );
}

interface VirtualAccountDisplayProps {
    bankCode: string;
    vaNumber: string;
    expiryDate: string;
    amount: number;
}

export function VirtualAccountDisplay({ bankCode, vaNumber, expiryDate, amount }: VirtualAccountDisplayProps) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(vaNumber);
        toast.success('VA Number copied to clipboard');
    };

    return (
        <Card className="overflow-hidden border-2 border-primary/20 bg-white shadow-xl dark:bg-slate-900">
            <CardContent className="p-0">
                <div className="bg-primary/10 px-6 py-4 dark:bg-primary/5">
                    <h3 className="flex items-center gap-2 font-bold text-primary">
                        <CreditCard className="h-5 w-5" />
                        Virtual Account
                    </h3>
                </div>
                <div className="p-8 text-center">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Virtual Account Number ({bankCode})</p>
                    <div className="my-6 flex items-center justify-center gap-3">
                        <span className="font-mono text-4xl font-black tracking-widest text-slate-900 dark:text-white">{vaNumber}</span>
                        <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-10 w-10 text-slate-400 hover:text-primary">
                            <Copy className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="mx-auto mb-6 max-w-sm rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Total Pembayaran</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">Rp {new Intl.NumberFormat('id-ID').format(amount)}</p>
                    </div>

                    <div className="flex justify-center gap-2 text-xs text-slate-500">
                        <span>Berakhir dalam:</span>
                        <Badge
                            variant="outline"
                            className="border-red-200 bg-red-50 text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400"
                        >
                            {new Date(expiryDate).toLocaleString()}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

interface QrDisplayProps {
    qrString: string;
    expiryDate: string;
    amount: number;
}

export function QrDisplay({ qrString, expiryDate, amount }: QrDisplayProps) {
    return (
        <Card className="overflow-hidden border-2 border-primary/20 bg-white shadow-xl dark:bg-slate-900">
            <CardContent className="p-0">
                <div className="bg-primary/10 px-6 py-4 dark:bg-primary/5">
                    <h3 className="flex items-center gap-2 font-bold text-primary">
                        <Smartphone className="h-5 w-5" />
                        QRIS Payment
                    </h3>
                </div>
                <div className="flex flex-col items-center p-8 text-center">
                    <p className="mb-6 text-sm font-medium text-slate-500 dark:text-slate-400">Scan QRIS code with any e-wallet</p>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="rounded-2xl border-2 border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800"
                    >
                        <QRCodeSVG value={qrString} size={240} level="H" />
                    </motion.div>

                    <div className="mt-8 w-full max-w-sm rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Total Amount</span>
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                Rp {new Intl.NumberFormat('id-ID').format(amount)}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Badge
                            variant="outline"
                            className="border-red-200 bg-red-50 text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400"
                        >
                            Expires: {new Date(expiryDate).toLocaleString()}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
