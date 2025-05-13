import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GoogleLoginButton from './GoogleLoginButton';
import CaptchaBox from './CaptchaBox';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [captchaToken, setCaptchaToken] = useState('');
  const [error, setError] = useState('');
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [isLoading, setIsLoading] = useState(false);

  // 📍 Get user location on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        console.warn('Location error:', err);
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
      return setError("Please complete the CAPTCHA");
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          captchaToken,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
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
    } finally {
      setIsLoading(false);
    }
  };

  // Background gradient style
  const backgroundStyle = {
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
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
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
        top: '-100px',
        left: '-100px',
      }}></div>
      <div style={{
        ...shapeCommonStyle,
        width: '400px',
        height: '400px',
        background: 'linear-gradient(135deg, #007bff 0%, #00e5ff 100%)',
        bottom: '-150px',
        right: '-150px',
      }}></div>
      <div style={{
        ...shapeCommonStyle,
        width: '200px',
        height: '200px',
        background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
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
                    background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 20px rgba(106, 17, 203, 0.3)',
                  }}>
                    <i className="fas fa-lock text-white" style={{ fontSize: '1.8rem' }}></i>
                  </div>
                </div>
                <h2 className="fw-bold mb-2">Welcome Back</h2>
                <p className="text-muted">Sign in to your SmartBook account</p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="danger" className="d-flex align-items-center mb-4">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  <span>{error}</span>
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
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
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <Form.Label className="fw-semibold mb-0">Password</Form.Label>
                    <Link to="/forgot-password" className="text-decoration-none text-muted small">
                      Forgot Password?
                    </Link>
                  </div>
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
                {location.latitude && (
                  <div className="d-flex align-items-center mb-3 text-muted small">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    <span>Location data will be sent for security</span>
                  </div>
                )}

                {/* Submit Button */}
                <div className="d-grid mb-4">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={isLoading}
                    className="py-2 fw-semibold"
                    style={{
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                      border: 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign in'
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

                {/* Register Link */}
                <div className="text-center mt-4">
                  <p className="mb-0">
                    New to SmartBook?{' '}
                    <Link to="/register" className="text-decoration-none fw-semibold text-primary">
                      Create an account
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

export default Login;
