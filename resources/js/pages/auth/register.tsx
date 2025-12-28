import { SignupForm } from '@/components/signup-form';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function RegisterPage() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        phone_number: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <SignupForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                />
            </div>
        </div>
    );
}
