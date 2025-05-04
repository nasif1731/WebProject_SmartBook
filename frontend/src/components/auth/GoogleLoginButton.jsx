import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';

const GoogleLoginButton = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Google login failed');
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-3 text-center">
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <Spinner animation="border" variant="primary" className="mb-2" />}
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => setError('Google Login Failed')}
        width="100%"
      />
    </div>
  );
};

export default GoogleLoginButton;
