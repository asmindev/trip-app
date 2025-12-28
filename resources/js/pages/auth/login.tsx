import { LoginForm } from '@/components/login-form';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function LoginPage() {
    // 1. Setup Inertia Form
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // 2. Handle Submit
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <LoginForm data={data} setData={setData} errors={errors} processing={processing} onSubmit={submit} />
            </div>
        </div>
    );
}
