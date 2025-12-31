import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';

interface Props {
    flash: {
        success?: string;
        error?: string;
    };
}

export default function PaymentSimulation({ flash }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        payment_request_id: '',
        amount: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dev.payment.simulate'));
    };

    return (
        <div className="container mx-auto py-10">
            <Head title="Payment Simulation" />

            <Card className="mx-auto max-w-md">
                <CardHeader>
                    <CardTitle>Payment Simulation</CardTitle>
                    <CardDescription>Simulate Xendit Payment Request (Dev Only)</CardDescription>
                </CardHeader>
                <CardContent>
                    {flash.success && (
                        <Alert className="mb-4 border-green-200 bg-green-50 text-green-900">
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{flash.success}</AlertDescription>
                        </Alert>
                    )}

                    {flash.error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{flash.error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="payment_request_id">Payment Request ID</Label>
                            <Input
                                id="payment_request_id"
                                value={data.payment_request_id}
                                onChange={(e) => setData('payment_request_id', e.target.value)}
                                placeholder="pr-..."
                                required
                            />
                            {errors.payment_request_id && <p className="text-sm text-red-500">{errors.payment_request_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                placeholder="10000"
                                required
                            />
                            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                        </div>

                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing ? 'Simulating...' : 'Simulate Payment'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
