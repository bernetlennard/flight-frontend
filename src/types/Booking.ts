import type {Flight} from './Flight';

export interface Booking {
    id: number;
    userId: number;
    flight: Flight;
    bookingDate: string;
}