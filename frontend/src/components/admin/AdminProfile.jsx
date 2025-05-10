import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { BsPersonCircle,BsBook, BsBarChartFill, BsBookFill,BsPeople } from 'react-icons/bs';

const AdminProfile = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    avatar: '',
    latitude: null,
    longitude: null,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab] = useState('profile');

  useEffect(() => {
    if (!user?.token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        setFormData({
          fullName: data.fullName,
          avatar: data.avatar || '',
          latitude: data.latitude || null,
          longitude: data.longitude || null,
        });
      } catch (err) {
        setError('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    const formDataUpload = new FormData();
    formDataUpload.append('avatar', file);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/upload/avatar`, {
        method: 'POST',
        body: formDataUpload,
      });
      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        avatar: `${process.env.REACT_APP_API_BASE_URL}${data.url}`,
      }));
    } catch (err) {
      alert('❌ Failed to upload avatar');
    }
  };

  const renderProfileForm = () => (
    <Card className="p-4 shadow-sm">
      <h3 className="mb-4">👤 Admin Profile</h3>

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

        <Form.Group className="mb-3" controlId="avatarUpload">
          <Form.Label>Upload Avatar (PNG/JPG)</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleAvatarUpload} />
          {formData.avatar && (
            <div className="mt-2">
              <img
                src={formData.avatar}
                alt="Avatar Preview"
                style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid #ccc' }}
              />
            </div>
          )}
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

      {formData.latitude && formData.longitude && (
        <div className="mt-4">
          <h5>📍 Your Location</h5>
          <MapContainer
            center={[formData.latitude, formData.longitude]}
            zoom={13}
            style={{ height: '300px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />
            <Marker position={[formData.latitude, formData.longitude]}>
              <Popup>This is your saved location</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      {message && <Alert variant="success" className="mt-3">✅ {message}</Alert>}
      {error && <Alert variant="danger" className="mt-3">❌ {error}</Alert>}
    </Card>
  );

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white" style={{ width: "250px", minHeight: "100vh" }}>
        <div className="p-3 border-bottom border-secondary">
          <h4 className="mb-0 d-flex align-items-center">
            <BsBook className="me-2" /> SmartBook Admin
          </h4>
        </div>

        <div className="p-3">
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <button className="nav-link btn text-white" onClick={() => navigate("/admin/profile")}>
              <BsPersonCircle className="me-2" /> Profile
              </button>
            </li>
            <li className="nav-item mb-2">
            <button
                className={`nav-link btn ${activeTab === "dashboard" ? "text-primary" : "text-white"}`}
                onClick={() => navigate("/admin-dashboard")}
              >
                <BsBarChartFill className="me-2" /> Dashboard
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`nav-link btn ${activeTab === "users" ? "text-primary" : "text-white"}`}
                onClick={() => navigate("/admin/users")}
              >
                <BsPeople className="me-2" /> Users
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`nav-link btn ${activeTab === "books" ? "text-primary" : "text-white"}`}
                onClick={() => navigate("/admin/books")}
              ><BsBookFill className="me-2" /> Books
              </button>
            </li>
            <li className="nav-item mb-2">
                          <button className="nav-link btn text-white" onClick={() => navigate("/login")}>
                            <BsPersonCircle className="me-2" /> Logout
                          </button>
                        </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light">
        <Container fluid className="py-4">
          {activeTab === "profile" && renderProfileForm()}
          {/* Add other tab contents like dashboard here if needed */}
        </Container>
      </div>
    </div>
  );
};

export default AdminProfile;
