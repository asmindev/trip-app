import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { PaginatedData } from '@/types';
import { router } from '@inertiajs/react';
import { Eye, MoreHorizontal, Trash2 } from 'lucide-react';

interface Booking {
    id: number;
    booking_code: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    schedule: {
        id: number;
        departure_date: string;
        departure_time: string;
        ship: {
            name: string;
        };
        route: {
            name: string;
        };
        trip_type: {
            name: string;
        };
    };
    total_passengers: number;
    total_amount: string;
    payment_status: 'PENDING' | 'PAID' | 'EXPIRED' | 'REFUNDED' | 'FAILED';
    paid_at: string | null;
    created_at: string;
}

interface BookingTableProps {
    bookings: Booking[];
    pagination?: PaginatedData<Booking>;
}

export function BookingTable({ bookings, pagination }: BookingTableProps) {
    const getPaymentStatusBadge = (status: Booking['payment_status']) => {
        const variants = {
            PENDING: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
            PAID: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            EXPIRED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
            REFUNDED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            FAILED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        };

        return <Badge className={variants[status]}>{status}</Badge>;
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
        });
    };

    const formatTime = (timeString: string) => {
        return timeString.substring(0, 5); // HH:MM
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this booking?')) {
            router.delete(route('admin.bookings.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    if (bookings.length === 0) {
        return (
            <div className="flex h-32 items-center justify-center text-muted-foreground">
                <p>No bookings found</p>
            </div>
        );
    }

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Booking Code</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead>Passengers</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Booking Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.booking_code}</TableCell>
                            <TableCell>
                                <div>
                                    <p className="font-medium">{booking.user.name}</p>
                                    <p className="text-xs text-muted-foreground">{booking.user.email}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <p className="font-medium">
                                        {booking.schedule.ship.name} - {booking.schedule.route.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDate(booking.schedule.departure_date)} at {formatTime(booking.schedule.departure_time)}
                                    </p>
                                </div>
                            </TableCell>
                            <TableCell>{booking.total_passengers} pax</TableCell>
                            <TableCell className="font-medium">{formatCurrency(booking.total_amount)}</TableCell>
                            <TableCell>{getPaymentStatusBadge(booking.payment_status)}</TableCell>
                            <TableCell>{formatDate(booking.created_at)}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="size-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => router.visit(route('admin.bookings.show', booking.id))}>
                                            <Eye className="mr-2 size-4" />
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => handleDelete(booking.id)}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="mr-2 size-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
