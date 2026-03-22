// src/pages/Login.tsx
import { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type {AuthResponse} from '../types/Auth';

export default function Login() {
    // States für die Eingabefelder
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // UI-States
    const [isRegistering, setIsRegistering] = useState(false); // Wechselt zwischen Login und Registrierung
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isRegistering) {
                // 1. REGISTRIERUNG
                const regResponse = await fetch('http://localhost:8080/users/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password }),
                });

                if (!regResponse.ok) {
                    throw new Error('Registrierung fehlgeschlagen. Möglicherweise existiert diese E-Mail bereits.');
                }

                // Wir haben den User erstellt, aber wir brauchen das Token!
                // Deshalb machen wir direkt weiter mit dem Login.
            }

            // 2. LOGIN (Wird immer ausgeführt: Entweder normaler Login oder Auto-Login nach Registrierung)
            const loginResponse = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!loginResponse.ok) {
                throw new Error('Login fehlgeschlagen. E-Mail oder Passwort falsch.');
            }

            // Erfolg! Token speichern und weiterleiten
            const data: AuthResponse = await loginResponse.json();
            login(data.token, data.user);
            navigate('/flights');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Hilfsfunktion zum Umschalten zwischen den Modi
    const toggleMode = () => {
        setIsRegistering(!isRegistering);
        setError(null); // Alte Fehler beim Wechseln löschen
    };

    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Card style={{ width: '400px' }} className="shadow-sm">
                <Card.Header as="h4" className="text-center">
                    {isRegistering ? 'Neues Konto erstellen' : 'Login'}
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        {/* Namensfeld wird nur bei der Registrierung angezeigt */}
                        {isRegistering && (
                            <Form.Group className="mb-3" controlId="name">
                                <Form.Label>Vor- und Nachname</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Felix Huber"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required={isRegistering}
                                />
                            </Form.Group>
                        )}

                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>E-Mail Adresse</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="password">
                            <Form.Label>Passwort</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Passwort eingeben"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
                            {loading ? 'Bitte warten...' : (isRegistering ? 'Registrieren' : 'Einloggen')}
                        </Button>

                        {/* Umschalter (Toggle) */}
                        <div className="text-center mt-3">
                            <span className="text-muted">
                                {isRegistering ? 'Bereits ein Konto? ' : 'Noch kein Konto? '}
                            </span>
                            <Button variant="link" className="p-0 align-baseline" onClick={toggleMode}>
                                {isRegistering ? 'Hier einloggen' : 'Hier registrieren'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}