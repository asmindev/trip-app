import { PaginatedData } from '@/types';
import { TripRoute } from '@/pages/admin/routes/types';
import { Ship } from '@/pages/admin/ships/types';

export interface TripType {
    id: number;
    name: string;
    code: string;
    default_start_time?: string;
}

export interface Schedule {
    id: number;
    trip_route_id: number;
    trip_type_id: number;
    ship_id: number;
    departure_date: string;
    departure_time: string;
    arrival_time?: string;
    available_seats: number;
    status: 'SCHEDULED' | 'DEPARTED' | 'CANCELLED' | 'COMPLETED';
    created_at: string;
    updated_at: string;
    
    // Relations
    route?: TripRoute;
    ship?: Ship;
    tripType?: TripType;
}

export type ScheduleFormData = {
    trip_route_id: number;
    trip_type_id: number;
    ship_id: number;
    departure_date: Date | undefined;
    departure_time: string;
    available_seats: number;
    status?: 'SCHEDULED' | 'DEPARTED' | 'CANCELLED' | 'COMPLETED';
};

export type BulkScheduleFormData = {
    trip_route_id: number;
    trip_type_id: number;
    ship_id: number;
    start_date: Date | undefined;
    end_date: Date | undefined;
    days_of_week: number[]; // 0-6
    departure_time: string;
};
