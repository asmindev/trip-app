import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Anchor, Clock, Map, MapPin } from 'lucide-react';
import { RouteStatsData } from '../types';

interface RouteStatsProps {
    activeBranchName: string;
    stats: RouteStatsData;
}

export function RouteStats({ activeBranchName, stats }: RouteStatsProps) {
    const formatDuration = (mins: number) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-primary text-primary-foreground shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Active Branch</CardTitle>
                    <Anchor className="h-4 w-4 opacity-70" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold truncate">{activeBranchName}</div>
                    <p className="text-xs opacity-70">Operational Network</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
                    <Map className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total_routes}</div>
                    <p className="text-xs text-muted-foreground">Available paths</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Total Waypoints</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total_waypoints}</div>
                    <p className="text-xs text-muted-foreground">Stops across all routes</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatDuration(stats.avg_duration)}</div>
                    <p className="text-xs text-muted-foreground">Across active routes</p>
                </CardContent>
            </Card>
        </div>
    );
}
