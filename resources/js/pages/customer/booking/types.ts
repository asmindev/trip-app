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
    trip_type: TripType;
}

export interface TripType {
    id: number;
    name: string;
    code: string;
}

export interface Pricelist {
    id: number;
    price_public: string;
    price_event: string;
    is_active: boolean;
}

export interface Passenger {
    full_name: string;
    id_card_number: string;
    whatsapp: string;
    email?: string;
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
    trip_type_id?: number[];
    shipClass?: ('ECONOMY' | 'VIP' | 'VVIP')[];
    facilities?: string[];
}

export interface Payment {
    id: number;
    booking_id: number;
    external_id: string;
    status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
    amount: number;
    payment_type: 'VIRTUAL_ACCOUNT' | 'QR_CODE';
    payment_channel: string;
    payment_code: string;
    expiration_date: string;
    paid_at?: string;
    qr_image?: string;
    xendit_id: string;
}

export interface Booking {
    id: number;
    booking_code: string;
    user_id: number;
    schedule_id: number;
    booking_date: string;
    total_amount: number;
    payment_status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
    payment?: Payment;
    passengers: Passenger[];
    schedule: Schedule;
}
