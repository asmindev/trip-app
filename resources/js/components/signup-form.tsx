import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

interface SignupFormProps extends React.ComponentProps<'div'> {
    data: {
        name: string;
        email: string;
        phone_number: string;
        password: string;
        password_confirmation: string;
    };
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export function SignupForm({ className, data, setData, errors, processing, onSubmit, ...props }: SignupFormProps) {
    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8">
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Daftar ke Trip App</h1>
                                <p className="text-sm text-balance text-muted-foreground">Buat akun baru untuk mulai memesan tiket</p>
                            </div>
                            <Field>
                                <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                                <FieldDescription>
                                    Kami akan menggunakan email ini untuk mengirim konfirmasi. Email tidak akan dibagikan ke pihak lain.
                                </FieldDescription>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="phone_number">Nomor Telepon</FieldLabel>
                                <Input
                                    id="phone_number"
                                    type="tel"
                                    placeholder="+628123456789"
                                    value={data.phone_number}
                                    onChange={(e) => setData('phone_number', e.target.value)}
                                    required
                                />
                                {errors.phone_number && <p className="text-sm text-red-600">{errors.phone_number}</p>}
                            </Field>
                            <Field className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="password_confirmation">Konfirmasi Password</FieldLabel>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    {errors.password_confirmation && <p className="text-sm text-red-600">{errors.password_confirmation}</p>}
                                </Field>
                            </Field>
                            <Field>
                                <Button type="submit" disabled={processing} className="w-full">
                                    {processing ? 'Mendaftarkan...' : 'Daftar'}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                    <div className="relative hidden bg-muted md:block">
                        <img
                            src="https://images.unsplash.com/photo-1693685282249-88ed2d7a4919?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyaXAlMjBzaGlwfGVufDB8fDB8fHww"
                            alt="Trip App - Perjalanan Laut"
                            className="absolute inset-0 h-full w-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                            }}
                        />
                    </div>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                Sudah punya akun?{' '}
                <Link href={route('login')} className="underline underline-offset-2 hover:underline">
                    Masuk di sini
                </Link>
            </FieldDescription>
            <FieldDescription className="px-6 text-center">
                Dengan mendaftar, Anda menyetujui <a href="#">Syarat Layanan</a> dan <a href="#">Kebijakan Privasi</a> kami.
            </FieldDescription>
        </div>
    );
}
