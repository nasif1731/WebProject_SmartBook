import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CaptchaBox from './CaptchaBox';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [captchaToken, setCaptchaToken] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!captchaToken) {
      return setError("Please complete the CAPTCHA");
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, captchaToken }),
      });

      const text = await res.text(); // handle HTML fallback
      let data;

      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        console.error('🔴 Non-JSON response:', text);
        throw new Error('Server error: Invalid response received');
      }

      if (!res.ok) throw new Error(data.message || 'Login failed');
      login(data);
      if (data.isAdmin) {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="p-4 shadow-sm">
            <Card.Title className="text-center mb-4">🔐 SmartBook Login</Card.Title>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <CaptchaBox onVerify={(token) => setCaptchaToken(token)} />

              <div className="d-grid mb-3">
                <Button variant="primary" type="submit">Login</Button>
              </div>

            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLogin;
