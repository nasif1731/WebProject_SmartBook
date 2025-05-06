import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';

const ConfirmReset = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmail');
    const storedOtp = localStorage.getItem('otpCode');

    if (!storedEmail || !storedOtp) {
      setError('Session expired. Please restart the password reset process.');
    } else {
      setEmail(storedEmail);
      setOtpCode(storedOtp);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newPassword || !confirmPassword) {
      return setError('Both fields are required');
    }

    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otpCode, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess('✅ Password reset successfully!');
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('otpCode');

      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Card className="p-4 shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
          <h3 className="mb-4 text-center">🔐 Reset Password</h3>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </Form.Group>

            <Button type="submit" variant="success" className="w-100">
              Reset Password
            </Button>
          </Form>

          {success && <Alert variant="success" className="mt-3">{success}</Alert>}
          {error && <Alert variant="danger" className="mt-3">❌ {error}</Alert>}
        </Card>
      </Container>
    </div>
  );
};

export default ConfirmReset;
