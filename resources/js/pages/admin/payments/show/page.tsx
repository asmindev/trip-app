import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import { Payment } from '@/pages/customer/booking/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Ban,
    Calendar,
    CheckCircle2,
    CircleDollarSign,
    Clock,
    CreditCard,
    ExternalLink,
    LucideIcon,
    Mail,
    Phone,
    RefreshCcw,
    User,
    Users,
} from 'lucide-react';

interface Props {
    payment: Payment;
}

export default function PaymentShow({ payment }: Props) {
    const booking = payment.booking;

    // Helper functions for formatting
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    const formatDate = (dateString?: string) =>
        dateString
            ? new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            : '-';

    const gatewayResponse =
        payment.gateway_response && typeof payment.gateway_response === 'string' ? JSON.parse(payment.gateway_response) : payment.gateway_response;

    const StatusBadge = ({ status }: { status: string }) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'> = {
            PAID: 'success',
            PENDING: 'warning',
            EXPIRED: 'destructive',
            FAILED: 'destructive',
        };

        const icons: Record<string, LucideIcon> = {
            PAID: CheckCircle2,
            PENDING: Clock,
            EXPIRED: Ban,
            FAILED: Ban,
        };

        const Icon = icons[status] || CircleDollarSign;

        return (
            <Badge
                variant={variants[status] || 'default'}
                className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium tracking-wide uppercase"
            >
                <Icon className="h-4 w-4" />
                {status}
            </Badge>
        );
    };
    const breadcrumbs = [
        { title: 'Payments', url: route('admin.payments.index') },
        { title: `Detail Pembayaran #${payment.external_id}`, url: '#' },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Payment #${payment.external_id}`} />

            <div className="flex flex-col space-y-8">
                {/* Page Header */}
                <div className="flex flex-col gap-4 pt-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <Link href={route('admin.payments.index')}>
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Detail Pembayaran</h1>
                        </div>
                        <p className="pl-10 text-muted-foreground">
                            ID Transaksi: <span className="font-mono font-medium text-foreground select-all">{payment.external_id}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3 pl-10 md:pl-0">
                        {payment.status === 'PENDING' && (
                            <Button variant="outline">
                                <RefreshCcw className="mr-2 h-4 w-4" />
                                Sinkronisasi Status
                            </Button>
                        )}
                        <StatusBadge status={payment.status} />
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column: Payment & Booking Details (2/3 width) */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* 1. Payment Information Card */}
                        <Card className="overflow-hidden border-l-4 border-l-primary pt-0 shadow-sm">
                            <CardHeader className="bg-muted/40 py-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <CreditCard className="h-5 w-5 text-primary" />
                                        Informasi Pembayaran
                                    </CardTitle>
                                    <span className="text-2xl font-bold text-primary">{formatCurrency(payment.amount)}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <InfoItem label="Metode Pembayaran" value={payment.payment_type?.replace('_', ' ')} />
                                    <InfoItem label="Channel / Bank" value={payment.payment_channel} />
                                    <InfoItem label="Kode Bayar / VA" value={payment.payment_code} isMono />
                                    <InfoItem label="Xendit ID" value={payment.xendit_id} isMono />

                                    <Separator className="col-span-full my-1" />

                                    <InfoItem label="Dibuat Pada" value={formatDate(payment.created_at)} />
                                    <InfoItem label="Kedaluwarsa Pada" value={formatDate(payment.expiration_date)} className="text-destructive" />
                                    {payment.paid_at && (
                                        <InfoItem
                                            label="Dibayar Pada"
                                            value={formatDate(payment.paid_at)}
                                            className="col-span-full font-medium text-green-600"
                                        />
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. Passenger Manifest */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Users className="h-5 w-5 text-muted-foreground" />
                                    Daftar Penumpang ({booking?.passengers?.length ?? 0})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-lg border">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50 text-left">
                                            <tr>
                                                <th className="h-10 w-[50px] px-4 font-medium text-muted-foreground">No</th>
                                                <th className="h-10 px-4 font-medium text-muted-foreground">Nama Lengkap</th>
                                                <th className="h-10 px-4 font-medium text-muted-foreground">Identitas (NIK/Paspor)</th>
                                                <th className="h-10 px-4 font-medium text-muted-foreground">Jenis</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {booking?.passengers?.map((pax: any, i: number) => (
                                                <tr key={i} className="transition-colors hover:bg-muted/50">
                                                    <td className="p-4 text-center text-muted-foreground">{i + 1}</td>
                                                    <td className="p-4 font-medium">{pax.full_name}</td>
                                                    <td className="p-4 font-mono text-muted-foreground">{pax.identity_number || '-'}</td>
                                                    <td className="p-4">
                                                        <Badge variant="outline" className="h-5 px-2 text-[10px]">
                                                            {pax.age_group || 'ADULT'}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                            {!booking?.passengers?.length && (
                                                <tr>
                                                    <td colSpan={4} className="p-6 text-center text-muted-foreground">
                                                        Tidak ada data penumpang
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 3. Technical Data (Parsed) */}
                        {gatewayResponse && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Detail Teknis Gateway</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                                        <InfoItem label="Reference ID" value={gatewayResponse.reference_id} isMono />
                                        <InfoItem label="Business ID" value={gatewayResponse.business_id} isMono />

                                        {gatewayResponse.payment_method && (
                                            <>
                                                <InfoItem label="PM Ref ID" value={gatewayResponse.payment_method.reference_id} isMono />
                                                <InfoItem label="PM Status" value={gatewayResponse.payment_method.status} />
                                            </>
                                        )}

                                        {gatewayResponse.failure_code && (
                                            <InfoItem
                                                label="Failure Code"
                                                value={gatewayResponse.failure_code}
                                                className="font-bold text-destructive"
                                            />
                                        )}

                                        <InfoItem label="Gateway Status" value={gatewayResponse.status} />
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column: Booking Overview (1/3 width) */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    Informasi Booking
                                </CardTitle>
                                <CardDescription>
                                    Kode:{' '}
                                    <Link href="#" className="font-mono font-medium text-primary hover:underline">
                                        {booking?.booking_code}
                                    </Link>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 text-sm">
                                <div className="rounded-lg border bg-muted/30 p-3">
                                    <div className="flex gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm">
                                            <User className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="truncate font-medium" title={booking?.user?.name}>
                                                {booking?.user?.name || 'Guest'}
                                            </p>
                                            <div className="mt-0.5 flex items-center gap-1 text-muted-foreground">
                                                <Mail className="h-3 w-3" />
                                                <span className="truncate text-xs" title={booking?.user?.email}>
                                                    {booking?.user?.email}
                                                </span>
                                            </div>
                                            {booking?.user?.phone && (
                                                <div className="mt-0.5 flex items-center gap-1 text-muted-foreground">
                                                    <Phone className="h-3 w-3" />
                                                    <span className="text-xs">{booking?.user?.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <div>
                                        <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Rute Perjalanan</span>
                                        <p className="mt-1 font-medium">{booking?.schedule?.route?.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Kapal</span>
                                        <p className="mt-1 font-medium">{booking?.schedule?.ship?.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Jadwal</span>
                                        <div className="mt-1 flex items-center gap-2">
                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span>{formatDate(booking?.schedule?.departure_date).split(',')[0]}</span> {/* Date only part */}
                                        </div>
                                        <div className="mt-1 flex items-center gap-2 font-medium">
                                            <Clock className="h-3.5 w-3.5 text-primary" />
                                            {booking?.schedule?.departure_time}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions / Help */}
                        <Card className="border-blue-100 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
                            <CardContent className="pt-6">
                                <h4 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">Butuh Bantuan?</h4>
                                <p className="mb-4 text-xs text-blue-700 dark:text-blue-300">
                                    Jika status pembayaran tidak sesuai, silakan cek dashboard Xendit untuk verifikasi manual.
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900"
                                    asChild
                                >
                                    <a href="https://dashboard.xendit.co" target="_blank" rel="noopener noreferrer">
                                        Buka Dashboard Xendit <ExternalLink className="ml-2 h-3 w-3" />
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function InfoItem({ label, value, className, isMono }: { label: string; value?: string | number; className?: string; isMono?: boolean }) {
    return (
        <div className={className}>
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</span>
            <p className={`mt-1 font-medium ${isMono ? 'font-mono text-sm' : 'text-sm sm:text-base'}`}>{value || '-'}</p>
        </div>
    );
}
