export interface StatsValue {
    current: number;
    last_month: number;
}

export interface DashboardStats {
    revenue: StatsValue;
    bookings: StatsValue;
    passengers: StatsValue;
    occupancy: { rate: number; label: string };
    active_ships: number;
    todays_departures: number;
}

export interface RevenueData {
    date: string;
    amount: number;
}

export interface RoutePerformance {
    name: string;
    total_bookings: number;
}

export interface RecentBooking {
    id: number;
    code: string;
    customer: string;
    route: string;
    amount: number;
    status: string;
    date: string;
}

export interface DashboardProps {
    stats: DashboardStats;
    revenueData: RevenueData[];
    routePerformance: RoutePerformance[];
    recentBookings: RecentBooking[];
}
