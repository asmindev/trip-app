import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Trash2, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';
import type { Control } from 'react-hook-form';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { Passenger } from '../types';

interface PassengerFormProps {
    control: Control<{ passengers: Passenger[] }>;
    bookerName?: string;
    bookerIdCard?: string;
}

export function PassengerForm({ control, bookerName, bookerIdCard }: PassengerFormProps) {
    const {
        register,
        setValue,
        watch,
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
            setValue(`passengers.${index}.is_booker`, true);
        } else {
            setValue(`passengers.${index}.is_booker`, false);
        }
    };

    const addPassenger = () => {
        append({
            full_name: '',
            id_card_number: '',
            gender: 'MALE',
            age_group: 'ADULT',
            is_booker: false,
        });
    };

    return (
        <div className="space-y-6">
            {fields.map((field, index) => (
                <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="border-slate-200 dark:border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-base font-semibold">Penumpang {index + 1}</CardTitle>
                            {fields.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                    onClick={() => remove(index)}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Same as Booker Checkbox */}
                            {index === 0 && bookerName && (
                                <div className="flex items-center space-x-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                                    <Checkbox
                                        id={`booker-${index}`}
                                        checked={watch(`passengers.${index}.is_booker`)}
                                        onCheckedChange={(checked) => handleCopyFromBooker(index, !!checked)}
                                    />
                                    <Label htmlFor={`booker-${index}`} className="cursor-pointer text-sm text-slate-600 dark:text-slate-400">
                                        Sama dengan data pemesan
                                    </Label>
                                </div>
                            )}

                            {/* Full Name */}
                            <div className="space-y-2">
                                <Label htmlFor={`passengers.${index}.full_name`}>
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id={`passengers.${index}.full_name`}
                                    placeholder="Nama sesuai KTP"
                                    {...register(`passengers.${index}.full_name`)}
                                    className="h-11"
                                />
                                {errors.passengers?.[index]?.full_name && (
                                    <p className="text-sm text-red-500">{errors.passengers[index].full_name?.message}</p>
                                )}
                            </div>

                            {/* ID Card Number */}
                            <div className="space-y-2">
                                <Label htmlFor={`passengers.${index}.id_card_number`}>
                                    Nomor KTP / NIK <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id={`passengers.${index}.id_card_number`}
                                    placeholder="16 digit NIK"
                                    maxLength={16}
                                    {...register(`passengers.${index}.id_card_number`)}
                                    className="h-11"
                                />
                                {errors.passengers?.[index]?.id_card_number && (
                                    <p className="text-sm text-red-500">{errors.passengers[index].id_card_number?.message}</p>
                                )}
                            </div>

                            {/* Gender */}
                            <div className="space-y-2">
                                <Label>
                                    Jenis Kelamin <span className="text-red-500">*</span>
                                </Label>
                                <RadioGroup
                                    defaultValue={field.gender}
                                    onValueChange={(value) => setValue(`passengers.${index}.gender`, value as 'MALE' | 'FEMALE')}
                                    className="flex gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="MALE" id={`gender-male-${index}`} />
                                        <Label htmlFor={`gender-male-${index}`} className="cursor-pointer">
                                            Laki-laki
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="FEMALE" id={`gender-female-${index}`} />
                                        <Label htmlFor={`gender-female-${index}`} className="cursor-pointer">
                                            Perempuan
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}

            {/* Add Passenger Button */}
            <Button type="button" variant="outline" className="w-full" onClick={addPassenger}>
                <UserPlus className="mr-2 size-4" />
                Tambah Penumpang
            </Button>
        </div>
    );
}
