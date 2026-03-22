export interface Flight {
    id: number;
    departureLocation: string;
    arrivalLocation: string;
    departureDate: string;
    departureTime: string;
    airline: string;
    price: number;
    availableTickets: number;
}