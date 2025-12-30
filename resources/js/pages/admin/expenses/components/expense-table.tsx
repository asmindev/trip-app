import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Expense {
    id: number;
    amount: number;
    expense_date: string;
    description: string;
    approval_status: string;
    proof_file: string | null;
    branch: { id: number; name: string };
    category: { id: number; name: string };
    creator: { id: number; name: string };
}

interface ExpenseTableProps {
    expenses: Expense[];
}

export function ExpenseTable({ expenses }: ExpenseTableProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[120px]">Tanggal</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Cabang</TableHead>
                    <TableHead>Nominal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Dibuat Oleh</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {expenses.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                            Belum ada data pengeluaran.
                        </TableCell>
                    </TableRow>
                ) : (
                    expenses.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">
                                {new Date(item.expense_date).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </TableCell>
                            <TableCell>
                                <div className="font-medium text-foreground">{item.description}</div>
                                {item.proof_file && (
                                    <a
                                        href={`/storage/${item.proof_file}`}
                                        target="_blank"
                                        className="text-xs text-primary underline hover:no-underline"
                                    >
                                        Lihat Bukti
                                    </a>
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="font-normal">
                                    {item.category.name}
                                </Badge>
                            </TableCell>
                            <TableCell>{item.branch.name}</TableCell>
                            <TableCell className="font-mono font-bold">{formatCurrency(item.amount)}</TableCell>
                            <TableCell>
                                <Badge
                                    variant={item.approval_status === 'APPROVED' ? 'default' : 'secondary'}
                                    className={
                                        item.approval_status === 'APPROVED'
                                            ? 'border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                            : item.approval_status === 'REJECTED'
                                              ? 'border-red-200 bg-red-100 text-red-700 hover:bg-red-100'
                                              : 'border-amber-200 bg-amber-100 text-amber-700 hover:bg-amber-100'
                                    }
                                >
                                    {item.approval_status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right text-sm text-muted-foreground">{item.creator.name}</TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
