export interface Waypoint {
    name: string;
    time: string;
}

export interface TripRoute {
    id: number;
    name: string;
    duration_minutes: number;
    points: number;
    branch_id: number;
    status: 'ACTIVE' | 'INACTIVE';
    waypoints: Waypoint[] | null;
    branch?: {
        id: number;
        name: string;
    };
}

export interface RouteStatsData {
    total_routes: number;
    total_waypoints: number;
    avg_duration: number;
}
