import { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: send OTP, 2: verify OTP
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    await sendOtpRequest();
  };

  const sendOtpRequest = async () => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess('✅ OTP sent to your email');
      setStep(2);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    await sendOtpRequest();
    setResending(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp) {
      return setError('OTP is required');
    }

    try {
      // Save email + OTP to localStorage and redirect to ConfirmReset
      localStorage.setItem('resetEmail', email);
      localStorage.setItem('otpCode', otp);
      navigate('/confirm-reset'); // 👈 redirect to cleaner reset page
    } catch (err) {
      setError('Failed to verify OTP');
    }
  };

  return (
    <Container className="py-5">
      <Card className="p-4 shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
        <h3>🔐 Forgot Password</h3>
        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={step === 2}
            />
          </Form.Group>

          {step === 2 && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Enter OTP</Form.Label>
                <Form.Control
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-between mb-3">
                <Button variant="link" onClick={handleResendOtp} disabled={resending}>
                  {resending ? 'Resending...' : 'Resend OTP'}
                </Button>
              </div>
            </>
          )}

          <Button type="submit" variant="primary" className="w-100">
            {step === 1 ? 'Send OTP' : 'Verify OTP'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default ForgotPassword;