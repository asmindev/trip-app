import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { RevenueData } from '../types';

interface RevenueChartProps {
    data: RevenueData[];
}

const chartConfig = {
    revenue: {
        label: 'Pendapatan',
        color: 'var(--primary)',
    },
} satisfies ChartConfig;

export function RevenueChart({ data }: RevenueChartProps) {
    return (
        <Card className="col-span-4 shadow-sm">
            <CardHeader>
                <CardTitle>Tren Pendapatan</CardTitle>
                <CardDescription>Performa penjualan tiket dalam 30 hari terakhir.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <AreaChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                className="text-xs font-medium text-muted-foreground"
                                minTickGap={30}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                width={80} // Increased width to prevent label clipping
                                className="text-xs font-medium text-muted-foreground"
                                tickFormatter={(val) => {
                                    if (val >= 1000000) return `Rp${(val / 1000000).toFixed(1)}jt`;
                                    if (val >= 1000) return `Rp${(val / 1000).toFixed(0)}k`;
                                    return `Rp${val}`;
                                }}
                            />
                            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/30" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="var(--primary)"
                                fillOpacity={1}
                                fill="url(#fillRevenue)"
                                strokeWidth={2}
                                activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--primary)' }}
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    );
}
