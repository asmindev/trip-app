import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

interface LoginFormProps extends React.ComponentProps<'div'> {
    data: {
        email: string;
        password: string;
        remember: boolean;
    };
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export function LoginForm({ className, data, setData, errors, processing, onSubmit, ...props }: LoginFormProps) {
    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form onSubmit={onSubmit} className="p-6 md:p-8">
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Login ke Trip App</h1>
                                <p className="text-balance text-muted-foreground">Masukkan kredensial Anda untuk melanjutkan</p>
                            </div>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@tripapp.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                                        Lupa password?
                                    </a>
                                </div>
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
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="remember" checked={data.remember} onCheckedChange={(checked) => setData('remember', checked)} />
                                    <label
                                        htmlFor="remember"
                                        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Ingat saya
                                    </label>
                                </div>
                            </Field>
                            <Field>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Sedang Masuk...' : 'Masuk'}
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
                Belum punya akun?{' '}
                <Link href={route('register')} className="underline underline-offset-2 hover:underline">
                    Daftar sekarang
                </Link>
            </FieldDescription>
        </div>
    );
}
