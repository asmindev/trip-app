import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RecentBooking } from '../types';

interface RecentBookingsTableProps {
    bookings: RecentBooking[];
}

export function RecentBookingsTable({ bookings }: RecentBookingsTableProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                    <CardTitle>Transaksi Terbaru</CardTitle>
                    <CardDescription>Menampilkan transaksi pemesanan tiket terkini.</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                    Lihat Semua Transaksi
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Kode</TableHead>
                            <TableHead>Pelanggan</TableHead>
                            <TableHead className="hidden md:table-cell">Rute</TableHead>
                            <TableHead className="hidden md:table-cell">Waktu</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell className="font-medium text-primary">{booking.code}</TableCell>
                                <TableCell>
                                    <div className="font-medium">{booking.customer}</div>
                                </TableCell>
                                <TableCell className="hidden text-muted-foreground md:table-cell">{booking.route}</TableCell>
                                <TableCell className="hidden text-xs text-muted-foreground md:table-cell">{booking.date}</TableCell>
                                <TableCell>{formatCurrency(booking.amount)}</TableCell>
                                <TableCell className="text-right">
                                    <Badge
                                        variant={booking.status === 'PAID' ? 'default' : 'secondary'}
                                        className={` ${
                                            booking.status === 'PAID'
                                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                : 'bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400'
                                        } `}
                                    >
                                        {booking.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
