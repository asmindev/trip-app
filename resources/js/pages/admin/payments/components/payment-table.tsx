import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';
import { ExternalLink, Eye } from 'lucide-react';

interface Payment {
    id: number;
    external_id: string;
    xendit_id: string | null;
    checkout_url: string | null;
    payment_method: string | null;
    status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
    amount: string;
    paid_at: string | null;
    created_at: string;
    booking: {
        id: number;
        booking_code: string;
        user: {
            name: string;
            email: string;
        };
        schedule: {
            departure_date: string;
            ship: {
                name: string;
            };
            route: {
                name: string;
            };
        };
    };
}

interface PaymentTableProps {
    payments: Payment[];
}

export function PaymentTable({ payments }: PaymentTableProps) {
    const getStatusBadge = (status: Payment['status']) => {
        const variants = {
            PENDING: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
            PAID: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            EXPIRED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
            FAILED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        };

        return <Badge className={variants[status]}>{status}</Badge>;
    };

    const getPaymentMethodBadge = (method: string | null) => {
        if (!method) return <span className="text-xs text-muted-foreground">N/A</span>;

        const variants: Record<string, string> = {
            BANK_TRANSFER: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            EWALLET: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
            QRIS: 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400',
            CREDIT_CARD: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
        };

        const displayName = method.replace(/_/g, ' ');
        const variant = variants[method] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';

        return <Badge className={variant}>{displayName}</Badge>;
    };

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(parseFloat(amount));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (payments.length === 0) {
        return (
            <div className="flex h-32 items-center justify-center text-muted-foreground">
                <p>No payments found</p>
            </div>
        );
    }

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>External ID</TableHead>
                        <TableHead>Booking</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {payments.map((payment) => (
                        <TableRow key={payment.id}>
                            <TableCell className="font-mono text-xs">{payment.external_id}</TableCell>
                            <TableCell>
                                <div>
                                    <p className="font-medium">{payment.booking.booking_code}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {payment.booking.schedule.ship.name} - {payment.booking.schedule.route.name}
                                    </p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <p className="font-medium">{payment.booking.user.name}</p>
                                    <p className="text-xs text-muted-foreground">{payment.booking.user.email}</p>
                                </div>
                            </TableCell>
                            <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                            <TableCell>{getPaymentMethodBadge(payment.payment_method)}</TableCell>
                            <TableCell>{getStatusBadge(payment.status)}</TableCell>
                            <TableCell className="text-sm">
                                {payment.paid_at ? formatDate(payment.paid_at) : formatDate(payment.created_at)}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    {payment.checkout_url && payment.status === 'PENDING' && (
                                        <Button variant="outline" size="sm" onClick={() => window.open(payment.checkout_url!, '_blank')}>
                                            <ExternalLink className="mr-2 size-3" />
                                            Open
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="sm" onClick={() => router.visit(route('admin.payments.show', payment.id))}>
                                        <Eye className="mr-2 size-3" />
                                        Details
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
