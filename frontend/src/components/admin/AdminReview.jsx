import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Container,
  Card,
  ListGroup,
  Badge,
  Image,
} from 'react-bootstrap';
import {
  BsBook,
  BsPersonCircle,
  BsBarChartFill,
  BsPeople,
  BsBookFill,
} from 'react-icons/bs';

const AdminReview = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [setError] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/books/${bookId}/reviews`
      );
      const data = await res.json();
      setReviews(data || []);
    } catch (err) {
      setError('Failed to load reviews');
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="bg-dark text-white"
        style={{ width: '250px', minHeight: '100vh' }}
      >
        <div className="p-3 border-bottom border-secondary">
          <h4 className="mb-0 d-flex align-items-center">
            <BsBook className="me-2" /> SmartBook Admin
          </h4>
        </div>
        <div className="p-3">
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <button
                className="nav-link btn text-white"
                onClick={() => navigate('/admin/profile')}
              >
                <BsPersonCircle className="me-2" /> Profile
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className="nav-link btn text-white"
                onClick={() => navigate('/admin-dashboard')}
              >
                <BsBarChartFill className="me-2" /> Dashboard
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className="nav-link btn text-white"
                onClick={() => navigate('/admin/users')}
              >
                <BsPeople className="me-2" /> Users
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className="nav-link btn text-white"
                onClick={() => navigate('/admin/books')}
              >
                <BsBookFill className="me-2" /> Books
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className="nav-link btn text-white"
                onClick={() => navigate('/login')}
              >
                <BsPersonCircle className="me-2" /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-light min-vh-100 py-5 flex-grow-1">
        <Container>
         {/* All Reviews Card */}
          <Card className="p-4 shadow-sm">
            <h4 className="mb-3">📖 All Reviews</h4>
            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              <ListGroup>
                {reviews.map((r, idx) => (
                  <ListGroup.Item key={idx}>
                    <div className="d-flex align-items-start justify-content-between">
                      <div className="d-flex align-items-start">
                        {r.user?.avatar && (
                          <Image
                            src={r.user.avatar}
                            alt={r.user.fullName}
                            roundedCircle
                            style={{
                              width: '40px',
                              height: '40px',
                              objectFit: 'cover',
                              marginRight: '12px',
                            }}
                          />
                        )}
                        <div>
                          <strong>{r.user?.fullName || 'Anonymous'}</strong>
                          <div className="text-muted small mb-1">
                            {r.comment || 'No comment provided'}
                          </div>
                        </div>
                      </div>
                      <Badge bg="warning" text="dark">
                        {r.rating}★
                      </Badge>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default AdminReview;
