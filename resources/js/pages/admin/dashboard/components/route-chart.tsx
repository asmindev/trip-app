import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { RoutePerformance } from '../types';

interface RoutePerformanceChartProps {
    data: RoutePerformance[];
}

const chartConfig = {
    bookings: {
        label: 'Pemesanan',
        color: 'var(--chart-2)',
    },
} satisfies ChartConfig;

export function RoutePerformanceChart({ data }: RoutePerformanceChartProps) {
    return (
        <Card className="col-span-3 shadow-sm">
            <CardHeader>
                <CardTitle>Rute Terpopuler</CardTitle>
                <CardDescription>5 rute dengan pemesanan terbanyak.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                tickLine={false}
                                axisLine={false}
                                width={120}
                                className="text-xs font-medium text-muted-foreground"
                                tickFormatter={(value) => (value.length > 20 ? `${value.substring(0, 20)}...` : value)}
                            />
                            <ChartTooltip cursor={{ fill: 'transparent' }} content={<ChartTooltipContent />} />
                            <Bar dataKey="total_bookings" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={24} />
                        </BarChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    );
}
