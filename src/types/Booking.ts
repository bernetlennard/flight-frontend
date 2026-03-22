// src/types/Booking.ts
import type {Flight} from './Flight';

export interface Booking {
    id: number;
    userId: number;
    flight: Flight;
    bookingDate: string; // Kommt als ISO-String vom Backend
}