import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

const Profile = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: '', avatar: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        setFormData({ fullName: data.fullName, avatar: data.avatar || '' });
      } catch (err) {
        setError('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, [user.token]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      login({ ...user, fullName: data.user.fullName, avatar: data.user.avatar });
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Card className="p-4 shadow-sm">
          <h3 className="mb-4">👤 My Profile</h3>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="fullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="avatar">
              <Form.Label>Avatar URL</Form.Label>
              <Form.Control
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="Avatar URL"
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              Update Profile
            </Button>
          </Form>

          <Button
            onClick={() => navigate('/change-password')}
            className="mt-3"
            variant="outline-secondary"
          >
            🔐 Change Password
          </Button>

          {message && <Alert variant="success" className="mt-3">✅ {message}</Alert>}
          {error && <Alert variant="danger" className="mt-3">❌ {error}</Alert>}
        </Card>
      </Container>
    </div>
  );
};

export default Profile;
