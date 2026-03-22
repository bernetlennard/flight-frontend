import { useEffect, useState } from 'react';
import { Container, Table, Spinner, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import type {Booking} from '../types/Booking';

export default function BookingHistory() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth(); // Wir brauchen das Token für die Abfrage!

    useEffect(() => {
        if (!token) return;

        // GET Request an /bookings (Backend filtert automatisch nach dem eingeloggten User)
        fetch('http://localhost:8080/bookings', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) throw new Error('Fehler beim Laden der Buchungshistorie.');
                return response.json();
            })
            .then(data => {
                setBookings(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [token]);

    return (
        <Container className="mt-5 mb-5">
            <h2>Meine Buchungen</h2>
            <Card className="shadow-sm mt-4">
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}

                    {!error && (
                        loading ? (
                            <div className="text-center my-4">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : bookings.length === 0 ? (
                            <Alert variant="info" className="m-0">Du hast bisher noch keine Flüge gebucht.</Alert>
                        ) : (
                            <Table striped hover responsive className="m-0">
                                <thead>
                                <tr>
                                    <th>Buchungsdatum</th>
                                    <th>Flug</th>
                                    <th>Datum & Zeit</th>
                                    <th>Preis</th>
                                </tr>
                                </thead>
                                <tbody>
                                {bookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td className="align-middle">
                                            {new Date(booking.bookingDate).toLocaleString('de-CH')}
                                        </td>
                                        <td className="align-middle">
                                            <strong>{booking.flight.airline}</strong><br/>
                                            {booking.flight.departureLocation} ➔ {booking.flight.arrivalLocation}
                                        </td>
                                        <td className="align-middle">
                                            {booking.flight.departureDate}<br/>
                                            {booking.flight.departureTime}
                                        </td>
                                        <td className="align-middle fw-bold text-success">
                                            CHF {booking.flight.price.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        )
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}