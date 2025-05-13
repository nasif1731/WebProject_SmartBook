import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GoogleLoginButton from './GoogleLoginButton';
import CaptchaBox from './CaptchaBox';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    latitude: null,
    longitude: null,
  });
  const [captchaToken, setCaptchaToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      },
      (error) => {
        console.error('Geolocation error:', error);
      }
    );
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!captchaToken) {
      setIsLoading(false);
      return setError("Please verify you're not a robot");
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, captchaToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Background gradient style
  const backgroundStyle = {
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e0f2f1 100%)',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
  };

  // Shape styles
  const shapeCommonStyle = {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(60px)',
    opacity: '0.4',
  };

  return (
    <div style={backgroundStyle}>
      {/* Background shapes */}
      <div style={{
        ...shapeCommonStyle,
        width: '300px',
        height: '300px',
        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        top: '-100px',
        left: '-100px',
      }}></div>
      <div style={{
        ...shapeCommonStyle,
        width: '400px',
        height: '400px',
        background: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
        bottom: '-150px',
        right: '-150px',
      }}></div>
      <div style={{
        ...shapeCommonStyle,
        width: '200px',
        height: '200px',
        background: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}></div>

      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', padding: '2rem 0' }}>
        <Row className="w-100 justify-content-center">
  <Col xs={12} sm={10} md={8} lg={6} xl={5} className="mx-auto">

            <Card className="border-0 shadow-lg" style={{ 
              borderRadius: '16px', 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              padding: '2.5rem',
            }}>
              {/* Card Header */}
              <div className="text-center mb-4">
                <div className="d-flex justify-content-center mb-4">
                  <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 20px rgba(17, 153, 142, 0.3)',
                  }}>
                    <i className="fas fa-user-plus text-white" style={{ fontSize: '1.8rem' }}></i>
                  </div>
                </div>
                <h2 className="fw-bold mb-2">Create Account</h2>
                <p className="text-muted">Join SmartBook and get started today</p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="danger" className="d-flex align-items-center mb-4">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  <span>{error}</span>
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Full Name Field */}
                <Form.Group className="mb-4" controlId="formFullName">
                  <Form.Label className="fw-semibold">Full Name</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <i className="fas fa-user text-muted"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="fullName"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="border-start-0 ps-0"
                      style={{ borderRadius: '0 0.375rem 0.375rem 0' }}
                    />
                  </InputGroup>
                </Form.Group>

                {/* Email Field */}
                <Form.Group className="mb-4" controlId="formEmail">
                  <Form.Label className="fw-semibold">Email</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <i className="fas fa-envelope text-muted"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="border-start-0 ps-0"
                      style={{ borderRadius: '0 0.375rem 0.375rem 0' }}
                    />
                  </InputGroup>
                </Form.Group>

                {/* Password Field */}
                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label className="fw-semibold">Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <i className="fas fa-lock text-muted"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="border-start-0 ps-0"
                      style={{ borderRadius: '0 0.375rem 0.375rem 0' }}
                    />
                  </InputGroup>
                </Form.Group>

                {/* CAPTCHA */}
                <div className="mb-4">
                  <CaptchaBox onVerify={(token) => setCaptchaToken(token)} />
                </div>

                {/* Location Info */}
                {formData.latitude && (
                  <div className="d-flex align-items-center mb-3 text-muted small">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    <span>Location data will be sent for security</span>
                  </div>
                )}

                {/* Submit Button */}
                <div className="d-grid mb-4">
                  <Button 
                    variant="success" 
                    type="submit" 
                    disabled={isLoading}
                    className="py-2 fw-semibold"
                    style={{
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                      border: 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating account...
                      </>
                    ) : (
                      'Create account'
                    )}
                  </Button>
                </div>

                {/* Divider */}
                <div className="position-relative my-4">
                  <hr />
                  <div className="position-absolute top-50 start-50 translate-middle px-3 bg-white">
                    <span className="text-muted small text-uppercase">or continue with</span>
                  </div>
                </div>

                {/* Google Login */}
                <GoogleLoginButton />

                {/* Login Link */}
                <div className="text-center mt-4">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none fw-semibold text-success">
                      Sign in
                    </Link>
                  </p>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
