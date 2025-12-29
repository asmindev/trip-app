// Booking Flow Types

export interface Schedule {
    id: number;
    departure_date: string;
    departure_time: string;
    arrival_time?: string;
    available_seats: number;
    status: 'SCHEDULED' | 'DEPARTED' | 'COMPLETED' | 'CANCELLED';
    ship: {
        id: number;
        name: string;
        capacity: number;
        class?: 'ECONOMY' | 'VIP' | 'VVIP';
    };
    route: {
        id: number;
        name: string;
        origin: string;
        destination: string;
        duration_minutes?: number;
        waypoints?: Array<{ name: string; order: number }>;
        pricelists?: Pricelist[];
    };
    tripType: {
        id: number;
        name: string;
        code: 'PUBLIC' | 'EVENT';
    };
}

export interface Pricelist {
    id: number;
    price: string;
    age_group: 'ADULT' | 'CHILD' | 'INFANT';
    is_active: boolean;
}

export interface Passenger {
    full_name: string;
    id_card_number: string;
    gender: 'MALE' | 'FEMALE';
    age_group: 'ADULT' | 'CHILD' | 'INFANT';
    is_booker?: boolean;
}

export interface BookingFormData {
    schedule_id: number;
    passengers: Passenger[];
    promo_code?: string;
}

export interface SearchFilters {
    date?: string;
    origin?: string;
    destination?: string;
    passengers?: number;
    priceRange?: [number, number];
    departureTime?: ('morning' | 'afternoon' | 'night')[];
    shipClass?: ('ECONOMY' | 'VIP' | 'VVIP')[];
    facilities?: string[];
}
