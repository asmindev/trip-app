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
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { Schedule } from '../types';

interface ScheduleTableProps {
    schedules: Schedule[];
    onEdit: (schedule: Schedule) => void;
    onDelete: (schedule: Schedule) => void;
}

export function ScheduleTable({ schedules, onEdit, onDelete }: ScheduleTableProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SCHEDULED':
                return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
            case 'DEPARTED':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
            case 'COMPLETED':
                return 'bg-green-100 text-green-800 hover:bg-green-200';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 hover:bg-red-200';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="relative">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="w-[200px] font-semibold text-foreground">Date & Time</TableHead>
                        <TableHead className="font-semibold text-foreground">Route Info</TableHead>
                        <TableHead className="font-semibold text-foreground">Ship</TableHead>
                        <TableHead className="w-[180px] font-semibold text-foreground">Occupancy</TableHead>
                        <TableHead className="w-[120px] font-semibold text-foreground">Status</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {schedules.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No schedules found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        schedules.map((schedule) => {
                            const capacity = schedule.ship?.capacity || 100;
                            const booked = capacity - schedule.available_seats;
                            const percentage = Math.round((booked / capacity) * 100);

                            return (
                                <TableRow key={schedule.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{formatDate(schedule.departure_date)}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {schedule.departure_time} - {schedule.arrival_time ? schedule.arrival_time.split(' ')[1] : '-'}
                                                <span className="ml-1 text-[10px] text-muted-foreground/70">({schedule.tripType?.name})</span>
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{schedule.route?.name}</span>
                                            <span className="text-xs text-muted-foreground">{schedule.route?.duration_minutes} mins</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{schedule.ship?.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="w-[200px]">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex justify-between text-xs">
                                                <span>{booked} booked</span>
                                                <span className="text-muted-foreground">{schedule.available_seats} left</span>
                                            </div>
                                            <Progress value={percentage} className="h-2" />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${getStatusColor(schedule.status)} border-0`}>{schedule.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => onEdit(schedule)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                    onClick={() => onDelete(schedule)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
