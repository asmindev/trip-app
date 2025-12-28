import { Can } from '@/components/permissions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Eye, Map, MapPin, MoreHorizontal, Plus, Search, Trash2 } from 'lucide-react';
import { TripRoute } from '../types';

interface RouteTableProps {
    routes: TripRoute[];
    search: string;
    onSearchChange: (value: string) => void;
    onSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onCreateClick: () => void;
    onViewClick: (route: TripRoute) => void;
    onEditClick: (route: TripRoute) => void;
    onDeleteClick: (routeId: number) => void;
}

export function RouteTable({
    routes,
    search,
    onSearchChange,
    onSearchKeyDown,
    onCreateClick,
    onViewClick,
    onEditClick,
    onDeleteClick,
}: RouteTableProps) {
    const formatDuration = (mins: number) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    return (
        <Card>
            <CardHeader className="px-6 pt-6 pb-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <CardTitle className="text-xl">Route List</CardTitle>
                        <CardDescription>Manage available sea routes and their waypoints.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search routes..."
                                className="w-full bg-background pl-9 md:w-[250px]"
                                value={search}
                                onChange={(e) => onSearchChange(e.target.value)}
                                onKeyDown={onSearchKeyDown}
                            />
                        </div>
                        <Can permission="routes.create">
                            <Button onClick={onCreateClick} className="bg-primary hover:bg-primary/90">
                                <Plus className="mr-2 h-4 w-4" /> Add Route
                            </Button>
                        </Can>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead className="w-[35%] pl-6">Route Name</TableHead>
                            <TableHead className="w-[15%]">Duration</TableHead>
                            <TableHead className="w-[10%]">Stops</TableHead>
                            <TableHead className="w-[15%]">Status</TableHead>
                            <TableHead className="w-[25%] pr-6 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {routes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <Map className="mb-4 h-16 w-16 opacity-10" />
                                        <h3 className="text-lg font-medium text-foreground">No routes found</h3>
                                        <p className="text-sm">Create a new route to get started.</p>
                                        <Button variant="outline" className="mt-4" onClick={onCreateClick}>
                                            Create Route
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            routes.map((routeData) => (
                                <TableRow key={routeData.id} className="group transition-colors hover:bg-muted/50">
                                    <TableCell className="pl-6 font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                                                <Map className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-foreground">{routeData.name}</div>
                                                <div className="line-clamp-1 text-xs text-muted-foreground">
                                                    {routeData.waypoints && routeData.waypoints.length > 0
                                                        ? routeData.waypoints.map((w) => w.name).join(' → ')
                                                        : 'Direct'}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-mono">
                                            {formatDuration(routeData.duration_minutes)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <MapPin className="h-3 w-3" />
                                            <span className="text-sm">{routeData.waypoints?.length || 0}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={
                                                routeData.status === 'ACTIVE'
                                                    ? 'border-green-200 bg-green-50 text-green-700'
                                                    : 'border-gray-200 bg-gray-50 text-gray-600'
                                            }
                                        >
                                            {routeData.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="pr-6 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onViewClick(routeData)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <Can permission="routes.update">
                                                    <DropdownMenuItem onClick={() => onEditClick(routeData)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit Route
                                                    </DropdownMenuItem>
                                                </Can>
                                                <DropdownMenuSeparator />
                                                <Can permission="routes.delete">
                                                    <DropdownMenuItem
                                                        onClick={() => onDeleteClick(routeData.id)}
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete Route
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
