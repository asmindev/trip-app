import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Anchor, Calendar, DollarSign, Tag } from 'lucide-react';
import { Pricelist } from '../types';

interface PricelistStatsProps {
    pricelists: Pricelist[];
    activeBranchName?: string;
}

export function PricelistStats({ pricelists, activeBranchName }: PricelistStatsProps) {
    const totalPricelists = pricelists.length;
    const activePricelists = pricelists.filter((p) => p.is_active).length;

    // Calculate averages (safely handle division by zero)
    const avgPublicPrice = pricelists.length > 0 ? pricelists.reduce((sum, p) => sum + Number(p.price_public), 0) / pricelists.length : 0;

    const avgEventPrice = pricelists.length > 0 ? pricelists.reduce((sum, p) => sum + Number(p.price_event), 0) / pricelists.length : 0;

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-primary text-primary-foreground shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Branch</CardTitle>
                    <Anchor className="h-4 w-4 opacity-70" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">{activeBranchName || 'All Branches'}</div>
                    <p className="text-xs opacity-70">Pricing Configuration</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Prices</CardTitle>
                    <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalPricelists}</div>
                    <p className="text-xs text-muted-foreground">{activePricelists} Active</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Public Price</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(avgPublicPrice)}</div>
                    <p className="text-xs text-muted-foreground">Standard rates</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Event Price</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(avgEventPrice)}</div>
                    <p className="text-xs text-muted-foreground">Special event rates</p>
                </CardContent>
            </Card>
        </div>
    );
}
