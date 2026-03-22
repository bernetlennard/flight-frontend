import { useEffect, useState } from 'react';
import { Container, Table, Spinner, Alert, Form, Row, Col, Button, Card } from 'react-bootstrap';
import type {Flight} from '../types/Flight';
import { useAuth } from '../context/AuthContext'; // <-- WICHTIG: Unseren Auth-Hook importieren
import { useNavigate } from 'react-router-dom';

type SortDirection = 'asc' | 'desc';
type SortConfig = { key: keyof Flight; direction: SortDirection } | null;

export default function FlightOverview() {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [departureLocation, setDepartureLocation] = useState('');
    const [arrivalLocation, setArrivalLocation] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [airline, setAirline] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const [sortConfig, setSortConfig] = useState<SortConfig>(null);

    const { isAuthenticated, token } = useAuth();
    const navigate = useNavigate();

    //Funktion zum Buchen eines Fluges
    const handleBook = async (flightId: number) => {
        if (!token) return;

        try {
            const response = await fetch('http://localhost:8080/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Wichtig: Token mitsenden!
                },
                body: JSON.stringify({ flightId: flightId }) // Backend erwartet { "flightId": ... }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Fehler bei der Buchung.');
            }

            navigate('/bookings');

        } catch (err: any) {
            alert('Buchung fehlgeschlagen: ' + err.message);
        }
    };

    const fetchFlights = () => {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (departureLocation) params.append('departureLocation', departureLocation);
        if (arrivalLocation) params.append('arrivalLocation', arrivalLocation);
        if (departureDate) params.append('departureDate', departureDate);
        if (airline) params.append('airline', airline);
        if (maxPrice) params.append('maxPrice', maxPrice);

        fetch(`http://localhost:8080/flights?${params.toString()}`)
            .then(response => {
                if (!response.ok) throw new Error('Netzwerk-Fehler beim Laden der Flüge');
                return response.json();
            })
            .then(data => {
                setFlights(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchFlights();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchFlights();
    };

    const handleReset = () => {
        setDepartureLocation('');
        setArrivalLocation('');
        setDepartureDate('');
        setAirline('');
        setMaxPrice('');
        setTimeout(() => fetchFlights(), 0);
    };

    const requestSort = (key: keyof Flight) => {
        let direction: SortDirection = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedFlights = [...flights].sort((a, b) => {
        if (!sortConfig) return 0;

        const { key, direction } = sortConfig;

        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const getSortIcon = (key: keyof Flight) => {
        if (sortConfig?.key !== key) return ' ↕';
        return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    };

    return (
        <Container className="mt-5 mb-5">
            <h2>Flugübersicht</h2>

            <Card className="mb-4 shadow-sm">
                <Card.Header as="h5">Flüge suchen & filtern</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSearch}>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="4" controlId="departureLocation">
                                <Form.Label>Abreiseort</Form.Label>
                                <Form.Control type="text" placeholder="z.B. Zurich" value={departureLocation} onChange={(e) => setDepartureLocation(e.target.value)} />
                            </Form.Group>
                            <Form.Group as={Col} md="4" controlId="arrivalLocation">
                                <Form.Label>Zielort</Form.Label>
                                <Form.Control type="text" placeholder="z.B. London" value={arrivalLocation} onChange={(e) => setArrivalLocation(e.target.value)} />
                            </Form.Group>
                            <Form.Group as={Col} md="4" controlId="departureDate">
                                <Form.Label>Datum</Form.Label>
                                <Form.Control type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="6" controlId="airline">
                                <Form.Label>Fluggesellschaft</Form.Label>
                                <Form.Control type="text" placeholder="z.B. Swiss" value={airline} onChange={(e) => setAirline(e.target.value)} />
                            </Form.Group>
                            <Form.Group as={Col} md="6" controlId="maxPrice">
                                <Form.Label>Maximaler Preis (CHF)</Form.Label>
                                <Form.Control type="number" step="0.01" placeholder="z.B. 200" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                            </Form.Group>
                        </Row>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="outline-secondary" onClick={handleReset}>Filter zurücksetzen</Button>
                            <Button variant="primary" type="submit">Suchen</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            {error && <Alert variant="danger">{error}</Alert>}

            {!error && (
                loading ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2">Flüge werden geladen...</p>
                    </div>
                ) : sortedFlights.length === 0 ? (
                    <Alert variant="info">Keine Flüge für diese Kriterien gefunden.</Alert>
                ) : (
                    <Table striped bordered hover responsive className="shadow-sm">
                        <thead className="table-dark">
                        <tr>
                            <th style={{ cursor: 'pointer' }} onClick={() => requestSort('airline')}>Airline {getSortIcon('airline')}</th>
                            <th style={{ cursor: 'pointer' }} onClick={() => requestSort('departureLocation')}>Von {getSortIcon('departureLocation')}</th>
                            <th style={{ cursor: 'pointer' }} onClick={() => requestSort('arrivalLocation')}>Nach {getSortIcon('arrivalLocation')}</th>
                            <th style={{ cursor: 'pointer' }} onClick={() => requestSort('departureDate')}>Datum {getSortIcon('departureDate')}</th>
                            <th style={{ cursor: 'pointer' }} onClick={() => requestSort('departureTime')}>Zeit {getSortIcon('departureTime')}</th>
                            <th style={{ cursor: 'pointer' }} onClick={() => requestSort('price')}>Preis {getSortIcon('price')}</th>
                            <th style={{ cursor: 'pointer' }} onClick={() => requestSort('availableTickets')}>Tickets {getSortIcon('availableTickets')}</th>
                            {isAuthenticated && <th>Aktion</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {sortedFlights.map((flight) => (
                            <tr key={flight.id}>
                                <td className="align-middle">{flight.airline}</td>
                                <td className="align-middle">{flight.departureLocation}</td>
                                <td className="align-middle">{flight.arrivalLocation}</td>
                                <td className="align-middle">{flight.departureDate}</td>
                                <td className="align-middle">{flight.departureTime}</td>
                                <td className="align-middle fw-bold">CHF {flight.price.toFixed(2)}</td>
                                <td className="align-middle">
                                    {flight.availableTickets > 0 ? (
                                        <span className="badge bg-success">{flight.availableTickets}</span>
                                    ) : (
                                        <span className="badge bg-danger">Ausgebucht</span>
                                    )}
                                </td>

                                {isAuthenticated && (
                                    <td className="align-middle text-center">
                                        <Button
                                            variant="success"
                                            size="sm"
                                            disabled={flight.availableTickets === 0}
                                            onClick={() => handleBook(flight.id)}
                                        >
                                            Buchen
                                        </Button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )
            )}
        </Container>
    );
}