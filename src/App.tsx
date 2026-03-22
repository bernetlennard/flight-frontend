import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import FlightOverview from './pages/FlightOverview';
import Login from './pages/Login';
import BookingHistory from './pages/BookingHistory';
import { AuthProvider, useAuth } from './context/AuthContext';

function Navigation() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Flugbuchungssystem</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/flights">Flüge</Nav.Link>
                        {isAuthenticated && (
                            <Nav.Link as={Link} to="/bookings">Meine Buchungen</Nav.Link>
                        )}
                        {isAuthenticated ? (
                            <div className="d-flex align-items-center">
                                <span className="text-light me-3">Hallo, {user?.name}</span>
                                <Button variant="outline-light" size="sm" onClick={logout}>Logout</Button>
                            </div>
                        ) : (
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navigation />
                <Routes>
                    <Route path="/" element={<Navigate to="/flights" replace />} />
                    <Route path="/flights" element={<FlightOverview />} />
                    <Route path="/bookings" element={<BookingHistory />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;