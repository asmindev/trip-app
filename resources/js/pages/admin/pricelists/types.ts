export interface TripType {
    id: number;
    name: string;
    description?: string;
}

export interface TripRoute {
    id: number;
    name: string;
    // Add other route properties as needed
}

export interface Pricelist {
    id: number;
    trip_route_id: number;
    trip_type_id: number;
    price_public: number;
    price_event: number;
    effective_from: string; // Date string YYYY-MM-DD
    effective_until: string | null; // Date string YYYY-MM-DD
    is_active: boolean;
    trip_route?: TripRoute;
    trip_type?: TripType;
}

export interface PricelistFormData {
    trip_route_id: string | number;
    trip_type_id: string | number;
    price_public: string | number;
    price_event: string | number;
    effective_from: string;
    effective_until: string | null;
    is_active: boolean;
}
