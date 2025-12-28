import { Can } from '@/components/permissions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, MoreHorizontal, Plus, Search, Sparkles, Trash2 } from 'lucide-react';
import { Pricelist } from '../types';

interface PricelistTableProps {
    pricelists: Pricelist[];
    search: string;
    onSearchChange: (value: string) => void;
    onSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onCreateClick: () => void;
    onEditClick: (pricelist: Pricelist) => void;
    onDeleteClick: (id: number) => void;
}

export function PricelistTable({
    pricelists,
    search,
    onSearchChange,
    onSearchKeyDown,
    onCreateClick,
    onEditClick,
    onDeleteClick,
}: PricelistTableProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <Card className="bg-linear-to-br from-card to-muted/10">
            <CardHeader className="border-b border-border/50 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight">Price Configuration</h2>
                        <p className="text-sm text-muted-foreground">Manage pricing for routes and trip types</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search prices..."
                                className="h-9 w-full border-border/50 bg-background/50 pl-9 transition-colors focus:bg-background sm:w-[220px]"
                                value={search}
                                onChange={(e) => onSearchChange(e.target.value)}
                                onKeyDown={onSearchKeyDown}
                            />
                        </div>
                        <Can permission="pricelists.create">
                            <Button onClick={onCreateClick} className="h-9 gap-2 shadow-sm">
                                <Plus className="h-4 w-4" />
                                <span>Add Price</span>
                            </Button>
                        </Can>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-border/50 hover:bg-transparent">
                            <TableHead className="h-11 text-xs font-semibold tracking-wider text-muted-foreground/80 uppercase">Route</TableHead>
                            <TableHead className="h-11 text-xs font-semibold tracking-wider text-muted-foreground/80 uppercase">Type</TableHead>
                            <TableHead className="h-11 text-right text-xs font-semibold tracking-wider text-muted-foreground/80 uppercase">
                                Public
                            </TableHead>
                            <TableHead className="h-11 text-right text-xs font-semibold tracking-wider text-muted-foreground/80 uppercase">
                                Event
                            </TableHead>
                            <TableHead className="h-11 text-xs font-semibold tracking-wider text-muted-foreground/80 uppercase">Period</TableHead>
                            <TableHead className="h-11 w-24 text-xs font-semibold tracking-wider text-muted-foreground/80 uppercase">
                                Status
                            </TableHead>
                            <TableHead className="h-11 w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pricelists.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32">
                                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                            <Sparkles className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground">No prices configured yet</p>
                                        <p className="text-xs text-muted-foreground/70">Add your first price to get started</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            pricelists.map((price) => (
                                <TableRow key={price.id} className="group border-b border-border/30 transition-colors hover:bg-muted/30">
                                    <TableCell className="py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{price.trip_route?.name || 'Unknown'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="border-0 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary">
                                            {price.trip_type?.name || 'Unknown'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="text-sm font-semibold tabular-nums">{formatCurrency(price.price_public)}</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="text-sm text-muted-foreground tabular-nums">{formatCurrency(price.price_event)}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-xs text-muted-foreground">
                                            <span>{formatDate(price.effective_from)}</span>
                                            {price.effective_until && (
                                                <span className="text-muted-foreground/60">→ {formatDate(price.effective_until)}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={`border-0 px-2.5 py-0.5 text-xs font-medium ${
                                                price.is_active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-gray-100 text-gray-500'
                                            }`}
                                        >
                                            {price.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40">
                                                <Can permission="pricelists.update">
                                                    <DropdownMenuItem onClick={() => onEditClick(price)} className="gap-2">
                                                        <Edit className="h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                </Can>
                                                <DropdownMenuSeparator />
                                                <Can permission="pricelists.delete">
                                                    <DropdownMenuItem
                                                        onClick={() => onDeleteClick(price.id)}
                                                        className="gap-2 text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </Can>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
