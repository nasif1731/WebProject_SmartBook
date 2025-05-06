import { useEffect, useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmail');
    if (!storedEmail) {
      setError('No email found. Please start from Forgot Password.');
    } else {
      setEmail(storedEmail);
    }
  }, []);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp) {
      return setError('OTP is required');
    }

    // Store OTP for next step
    localStorage.setItem('otpCode', otp);
    navigate('/confirm-reset');
  };

  return (
    <Container className="py-5">
      <Card className="p-4 shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
        <h3>🔐 Verify OTP</h3>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleVerifyOtp}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} disabled />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Enter OTP</Form.Label>
            <Form.Control
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="Enter the 6-digit OTP"
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            Verify OTP & Continue
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default ResetPassword;
