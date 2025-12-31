import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Trash2, UserPlus, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { Control } from 'react-hook-form';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import type { Passenger } from '../types';

interface PassengerFormProps {
    control: Control<{ passengers: Passenger[] }>;
    bookerName?: string;
    bookerIdCard?: string;
    bookerPhone?: string;
}

export function PassengerForm({ control, bookerName, bookerIdCard, bookerPhone }: PassengerFormProps) {
    const {
        register,
        setValue,
        watch,
        trigger,
        formState: { errors },
    } = useFormContext<{ passengers: Passenger[] }>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'passengers',
    });

    const handleCopyFromBooker = (index: number, checked: boolean) => {
        if (checked && bookerName) {
            setValue(`passengers.${index}.full_name`, bookerName);
            if (bookerIdCard) {
                setValue(`passengers.${index}.id_card_number`, bookerIdCard);
            }
            if (bookerPhone) {
                setValue(`passengers.${index}.whatsapp`, bookerPhone);
            }
            setValue(`passengers.${index}.is_booker`, true);
        } else {
            setValue(`passengers.${index}.is_booker`, false);
        }
    };

    const addPassenger = async () => {
        // Trigger validation for all existing passengers
        const isValid = await trigger('passengers');

        if (!isValid) {
            toast.error('Mohon lengkapi data penumpang sebelumnya terlebih dahulu');
            return;
        }

        append({
            full_name: '',
            id_card_number: '',
            whatsapp: '',
            email: '',
            gender: 'MALE',
            age_group: 'ADULT',
            is_booker: false,
        });
    };

    return (
        <div className="space-y-6">
            <AnimatePresence mode="popLayout" initial={false}>
                {fields.map((field, index) => (
                    <motion.div
                        key={field.id}
                        layout
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.9, transition: { duration: 0.2 } }}
                        transition={{
                            type: 'spring',
                            stiffness: 350,
                            damping: 30,
                            mass: 1,
                        }}
                    >
                        <Card className="overflow-hidden rounded-none border-0 border-slate-200 p-0 shadow-none transition-shadow dark:border-slate-800 dark:bg-slate-950/20">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-3 sm:px-6 dark:border-slate-800 dark:bg-slate-900/50">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/20">
                                        <Users className="size-4" />
                                    </div>
                                    <CardTitle className="text-sm font-black tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                        Penumpang {index + 1}
                                    </CardTitle>
                                </div>
                                {fields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="size-9 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4 p-4 sm:p-6">
                                {/* Same as Booker Checkbox */}
                                {index === 0 && (!!bookerName || !!bookerPhone) && (
                                    <div className="flex items-center space-x-3 rounded-xl bg-orange-50/50 p-4 ring-1 ring-orange-200/50 dark:bg-orange-950/10 dark:ring-orange-900/20">
                                        <Checkbox
                                            id={`booker-${index}`}
                                            checked={watch(`passengers.${index}.is_booker`)}
                                            onCheckedChange={(checked) => handleCopyFromBooker(index, !!checked)}
                                        />
                                        <Label
                                            htmlFor={`booker-${index}`}
                                            className="cursor-pointer text-sm font-semibold text-orange-800 dark:text-orange-300"
                                        >
                                            Booking untuk diri sendiri
                                        </Label>
                                    </div>
                                )}

                                <div className="grid gap-5 md:grid-cols-2">
                                    {/* Full Name */}
                                    <div className="space-y-2.5">
                                        <Label
                                            htmlFor={`passengers.${index}.full_name`}
                                            className="text-xs font-bold tracking-wide text-slate-500 uppercase"
                                        >
                                            Nama Lengkap <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id={`passengers.${index}.full_name`}
                                            placeholder="Nama sesuai KTP"
                                            {...register(`passengers.${index}.full_name`)}
                                            className="h-12 border-slate-200 bg-slate-50/50 focus:bg-white dark:border-slate-800 dark:bg-slate-900/50"
                                        />
                                        {errors.passengers?.[index]?.full_name && (
                                            <p className="text-[11px] font-medium text-red-500">{errors.passengers[index].full_name?.message}</p>
                                        )}
                                    </div>

                                    {/* ID Card Number */}
                                    <div className="space-y-2.5">
                                        <Label
                                            htmlFor={`passengers.${index}.id_card_number`}
                                            className="text-xs font-bold tracking-wide text-slate-500 uppercase"
                                        >
                                            Nomor KTP / NIK <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id={`passengers.${index}.id_card_number`}
                                            placeholder="16 digit NIK"
                                            maxLength={16}
                                            {...register(`passengers.${index}.id_card_number`)}
                                            className="h-12 border-slate-200 bg-slate-50/50 focus:bg-white dark:border-slate-800 dark:bg-slate-900/50"
                                        />
                                        {errors.passengers?.[index]?.id_card_number && (
                                            <p className="text-[11px] font-medium text-red-500">{errors.passengers[index].id_card_number?.message}</p>
                                        )}
                                    </div>

                                    {/* Email Address (Optional) */}
                                    <div className="space-y-2.5">
                                        <Label
                                            htmlFor={`passengers.${index}.email`}
                                            className="text-xs font-bold tracking-wide text-slate-500 uppercase"
                                        >
                                            Email (Opsional)
                                        </Label>
                                        <Input
                                            id={`passengers.${index}.email`}
                                            type="email"
                                            placeholder="contoh@email.com"
                                            {...register(`passengers.${index}.email`)}
                                            className="h-12 border-slate-200 bg-slate-50/50 focus:bg-white dark:border-slate-800 dark:bg-slate-900/50"
                                        />
                                        {errors.passengers?.[index]?.email && (
                                            <p className="text-[11px] font-medium text-red-500">{errors.passengers[index].email?.message}</p>
                                        )}
                                    </div>

                                    {/* WhatsApp Number */}
                                    <div className="space-y-2.5">
                                        <Label
                                            htmlFor={`passengers.${index}.phone_number`}
                                            className="text-xs font-bold tracking-wide text-slate-500 uppercase"
                                        >
                                            Nomor WhatsApp (Wajib) <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id={`passengers.${index}.whatsapp`}
                                            placeholder="Contoh: 081234567890"
                                            inputMode="numeric"
                                            {...register(`passengers.${index}.whatsapp`)}
                                            className="h-12 border-slate-200 bg-slate-50/50 focus:bg-white dark:border-slate-800 dark:bg-slate-900/50"
                                        />
                                        {errors.passengers?.[index]?.whatsapp && (
                                            <p className="text-[11px] font-medium text-red-500">{errors.passengers[index].whatsapp?.message}</p>
                                        )}
                                        <p className="text-[10px] text-slate-400">Tiket QR Code akan dikirim ke nomor ini via WhatsApp.</p>
                                    </div>
                                </div>

                                {/* Gender */}
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold tracking-wide text-slate-500 uppercase">
                                        Jenis Kelamin <span className="text-red-500">*</span>
                                    </Label>
                                    <RadioGroup
                                        defaultValue={field.gender}
                                        onValueChange={(value) => setValue(`passengers.${index}.gender`, value as 'MALE' | 'FEMALE')}
                                        className="flex gap-6"
                                    >
                                        <div className="flex items-center space-x-2.5">
                                            <RadioGroupItem value="MALE" id={`gender-male-${index}`} />
                                            <Label htmlFor={`gender-male-${index}`} className="cursor-pointer font-medium">
                                                Laki-laki
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2.5">
                                            <RadioGroupItem value="FEMALE" id={`gender-female-${index}`} />
                                            <Label htmlFor={`gender-female-${index}`} className="cursor-pointer font-medium">
                                                Perempuan
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Add Passenger Button */}
            <motion.div layout className="p-4">
                <Button
                    type="button"
                    variant="outline"
                    className="h-14 w-full border-dashed border-slate-300 bg-slate-50/30 text-base font-bold text-slate-600 transition-all hover:border-primary hover:bg-orange-50 hover:text-primary dark:border-slate-800 dark:bg-slate-900/30"
                    onClick={addPassenger}
                >
                    <UserPlus className="mr-2 size-5" />
                    Tambah Penumpang Lainnya
                </Button>
            </motion.div>
        </div>
    );
}
